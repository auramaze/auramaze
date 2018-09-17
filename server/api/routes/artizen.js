const express = require('express');
const router = express.Router();
const request = require('request');
const common = require('./common');
const dynamodb = common.dynamodb;
const rds = common.rds;

// Check artizen has the required keys
function validateArtizen(artizen) {
    return common.validateItem(artizen);
}

/* GET artizen data. */
router.get('/:id', function (req, res, next) {
    common.getItem('artizen', req.params.id, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                res.json(data.Items[0]);
            } else {
                res.status(404).json({
                    code: 'ARTIZEN_NOT_FOUND',
                    message: `Artizen not found: ${req.params.id}`
                });
            }
        }
    });
});

/* PUT artizen username, data. */
router.put('/:username', function (req, res, next) {
    if (common.validateUsername(req.params.username)) {
        if (validateArtizen(req.body) && req.params.username === req.body.username) {
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
                    common.incrementId('artizen', function (err, result, fields) {
                        if (err) {
                            next(err);
                        } else {
                            const id = result[0].id;
                            const artizen = Object.assign(req.body, {id: parseInt(id)});
                            // Put artizen into DynamoDB table `artizen`
                            common.putItem('artizen', artizen, function (err, data) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.send(`Artizen put: ${req.params.username}`);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(400).json({
                code: 'ARTIZEN_DATA_INVALID',
                message: `Artizen data invalid: ${JSON.stringify(req.body)}`
            });
        }
    } else {
        res.status(400).json({
            code: 'USERNAME_INVALID',
            message: `Username invalid: ${req.params.username}`
        });
    }
});

/* DELETE artizen relations, data, username. */
router.delete('/:id', function (req, res, next) {
    common.getItem('artizen', req.params.id, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                const id = data.Items[0].id;
                const username = data.Items[0].username;
                // Delete artizen relations from Aurora table `archive`
                rds.query('DELETE FROM archive WHERE artizen_id=?', [parseInt(id)], function (err, result, fields) {
                    if (err) {
                        next(err);
                    } else {
                        // Delete artizen data from DynamoDB
                        common.deleteItem('artizen', id, function (err, data) {
                            if (err) {
                                next(err);
                            } else {
                                if (username) {
                                    // Delete artizen username from Aurora table `username`
                                    common.deleteUsername(username, function (err, result, fields) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.send(`Artizen deleted: ${req.params.id}`);
                                        }
                                    });
                                } else {
                                    res.send(`Artizen deleted: ${req.params.id}`);
                                }
                            }
                        });
                    }
                });
            } else {
                res.send(`Artizen not found: ${req.params.id}`);
            }
        }
    });
});

module.exports = router;
