const express = require('express');
const router = express.Router();
const _ = require('lodash');
const common = require('./common');
const dynamodb = common.dynamodb;
const rds = common.rds;
const dynamoose = require('dynamoose');
dynamoose.AWS.config.update({
    region: 'us-east-2',
});

const Art = dynamoose.model('art', { id: Number, title: String });

// Check art has the required keys for PUT request
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

// Add types to artizens in DynamoDB table `artizen`
function addTypes(relations, callback) {
    if (!relations) {
        callback(null);
    } else {
        let add = _.after(relations.length, function () {
            callback(null);
        });
        for (let relation of relations) {
            common.addType(relation.artizen, relation.type, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    add();
                }
            });
        }
    }
}

/* GET art data. */
router.get('/:id', function (req, res, next) {
    Art.get({id:'10000001'}, function (art) {
        res.json(art);
    });
});

/* GET art relations. */
router.get('/:id/artizen', function (req, res, next) {
    // Check art exists
    common.getItem('art', req.params.id, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                // Get artizen id and type from Aurora table `archive`
                let sql, parameters;
                if (req.query.type) {
                    sql = 'SELECT * FROM archive WHERE art_id=? AND type=? ORDER BY artizen_id DESC';
                    parameters = [parseInt(data.Items[0].id), req.query.type];
                } else {
                    sql = 'SELECT * FROM archive WHERE art_id=? ORDER BY artizen_id DESC';
                    parameters = [parseInt(data.Items[0].id)];
                }
                rds.query(sql, parameters, function (err, result, fields) {
                    if (result.length) {
                        // Get artizen ids and remove duplicate
                        const artizen_ids = result.map(item => item.artizen_id).filter(function (item, index, array) {
                            return !index || item !== array[index - 1];
                        }).map(item => ({id: parseInt(item)}));

                        // Get other attributes from DynamoDB table `artizen`
                        const params = {
                            RequestItems: {
                                'artizen': {
                                    Keys: artizen_ids,
                                    ProjectionExpression: '#id, #name, #avatar',
                                    ExpressionAttributeNames: {
                                        '#id': 'id',
                                        '#name': 'name',
                                        '#avatar': 'avatar'
                                    }
                                }
                            },
                        };
                        dynamodb.batchGet(params, function (err, data) {
                            if (err) {
                                next(err);
                            } else {
                                data = data.Responses.artizen;

                                // Convert data to dict
                                const artizen_dict = data.reduce((acc, cur) => {
                                    acc[cur.id.toString()] = cur;
                                    return acc;
                                }, {});

                                // Add DynamoDB data to Aurora results
                                result = result.map(item => Object.assign({type: item.type}, {data: artizen_dict[item.artizen_id.toString()]}));

                                // Group by type
                                result = result.reduce((acc, cur) => {
                                    (acc[cur.type] = acc[cur.type] || []).push(cur.data);
                                    return acc;
                                }, {});

                                // Convert object to array
                                result = Object.keys(result).map(function (key) {
                                    return {type: key, data: result[key]};
                                });
                                res.json(result);
                            }
                        });
                    } else {
                        // No relations found
                        res.json([]);
                    }
                });
            } else {
                res.status(404).json({
                    code: 'ART_NOT_FOUND',
                    message: `Art not found: ${req.params.id}`
                });
            }
        }
    });
});

/* PUT art username, data, relations. */
router.put('/:username', function (req, res, next) {
    if (common.validateUsername(req.params.username)) {
        if (validateArt(req.body) && req.params.username === req.body.username) {
            let relations = req.body.relations;
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
                        // Convert artizen usernames to ids
                        relations = relations.map(relation => ({
                            artizen: exists[relation.artizen],
                            type: relation.type
                        }));
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
                                                // Add types to artizen data in DynamoDB table `artizen`
                                                addTypes(relations, function (err) {
                                                    if (err) {
                                                        next(err);
                                                    } else {
                                                        // Insert art's relations with artizens into Aurora table `archive`
                                                        rds.query('INSERT INTO archive (art_id, artizen_id, type) VALUES ?',
                                                            [relations.map(relation => [parseInt(id), parseInt(relation.artizen), relation.type])],
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
                // Delete art id and relations from Aurora table `art` and `archive`
                rds.query('DELETE FROM art WHERE id=?', [parseInt(id)], function (err, result, fields) {
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
