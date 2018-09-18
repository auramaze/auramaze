const express = require('express');
const router = express.Router();
const _ = require('lodash');
const common = require('./common');
const rds = common.rds;

// Check art has the required keys
function validateArt(art) {
    return common.validateItem(art) && Boolean(art.relations);
}

// Check if usernames of all artizens exist in DynamoDB table `artizen`
// Return an object with username as key and id/false as value
function checkArtizens(usernames, callback) {
    for (let username of usernames) {
        if (!common.validateUsername(username)) {
            return false;
        }
    }
    if (usernames.length === 0 || (new Set(usernames)).size !== usernames.length) {
        return false;
    }

    let exists = {};
    let check = _.after(usernames.length, function () {
        callback(null, exists);
    });
    for (let username of usernames) {
        common.getItem('artizen', username, function (err, data) {
            if (err) {
                callback(err, false);
            } else {
                if (data.Count) {
                    exists[username] = data.Items[0].id;
                } else {
                    exists[username] = false;
                }
                check();
            }
        });
    }
}

/* GET art data. */
router.get('/:id', function (req, res, next) {
    common.getItem('art', req.params.id, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                res.json(data.Items[0]);
            } else {
                res.status(404).json({
                    code: 'ART_NOT_FOUND',
                    message: `Art not found: ${req.params.id}`
                });
            }
        }
    });
});

/* PUT art username, data. */
router.put('/:username', function (req, res, next) {
    if (common.validateUsername(req.params.username)) {
        if (validateArt(req.body) && req.params.username === req.body.username) {
            const relations = req.body.relations;
            const usernames = relations.map(relation => relation.artizen);
            // Check if all artizen username exist in DynamoDB table `artizen`
            checkArtizens(usernames, function (err, exists) {
                if (err) {
                    next(err);
                } else {
                    const allExist = Object.keys(exists).every(function (k) {
                        return exists[k];
                    });
                    if (!allExist) {
                        const nonExistUsernames = usernames.filter(username => !exists[username]);
                        res.status(404).json({
                            code: 'RELATED_ARTIZEN_NOT_FOUND',
                            message: `Related artizen not found: ${req.params.username} ${JSON.stringify(nonExistUsernames)}`
                        });
                    } else {
                        // Insert username of art into Aurora table `username`
                        common.insertUsername(req.params.username, function (err, result, fields) {
                            if (err) {
                                if (err.code === 'ER_DUP_ENTRY') {
                                    res.status(400).json({
                                        code: 'USERNAME_EXIST',
                                        message: `Username already exists: ${req.params.username}`
                                    });
                                } else {
                                    next(err);
                                }
                            } else {
                                // Increment id in Aurora table `artizen_id`
                                common.incrementId('art', function (err, result, fields) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        const id = result[0].id;
                                        const art = Object.assign(_.omit(req.body, 'relations'), {id: parseInt(id)});
                                        // Put art into DynamoDB table `art`
                                        common.putItem('art', art, function (err, data) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                // Insert art's relations with artizens into Aurora table `archive`
                                                rds.query('INSERT INTO archive (artizen_id, art_id, type) VALUES ?',
                                                    [relations.map(relation => [parseInt(exists[relation.artizen]), parseInt(id), relation.type])],
                                                    function (err, result, fields) {
                                                        if (err) {
                                                            next(err);
                                                        } else {
                                                            res.send('Art put: ' + req.params.username);
                                                        }
                                                    });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.status(400).json({
                code: 'ART_DATA_INVALID',
                message: `Art data invalid: ${JSON.stringify(req.body)}`
            });
        }
    } else {
        res.status(400).json({
            code: 'USERNAME_INVALID',
            message: `Username invalid: ${req.params.username}`
        });
    }
});

/* DELETE art relations, data, username. */
router.delete('/:id', function (req, res, next) {
    common.getItem('art', req.params.id, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                const id = data.Items[0].id;
                const username = data.Items[0].username;
                // Delete art relations from Aurora table `archive`
                rds.query('DELETE FROM archive WHERE art_id=?', [parseInt(id)], function (err, result, fields) {
                    if (err) {
                        next(err);
                    } else {
                        // Delete art data from DynamoDB
                        common.deleteItem('art', id, function (err, data) {
                            if (err) {
                                next(err);
                            } else {
                                if (username) {
                                    // Delete art username from Aurora table `username`
                                    common.deleteUsername(username, function (err, result, fields) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.send('Art deleted: ' + req.params.id);
                                        }
                                    });
                                } else {
                                    res.send('Art deleted: ' + req.params.id);
                                }
                            }
                        });
                    }
                });
            } else {
                res.send('Art not found: ' + req.params.id);
            }
        }
    });
});

module.exports = router;
