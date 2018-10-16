const express = require('express');
const router = express.Router();
const _ = require('lodash');
const common = require('./common');
const dynamodb = common.dynamodb;
const rds = common.rds;
const {param, query, body, oneOf, validationResult} = require('express-validator/check');

// Check if usernames of all artizens exist in DynamoDB table `artizen`
// Return an object with username as key and id/false as value
function checkArtizens(usernames, callback) {
    let exists = {};
    let check = _.after(usernames.length, () => {
        callback(null, exists);
    });
    for (let username of usernames) {
        common.checkExist('artizen', username, (err, id) => {
            /* istanbul ignore if */
            if (err) {
                callback(err, false);
            } else {
                if (id) {
                    exists[username] = id;
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
    let add = _.after(relations.length, () => {
        callback(null);
    });
    for (let relation of relations) {
        common.addType(relation.artizen, relation.type, (err, data) => {
            /* istanbul ignore if */
            if (err) {
                callback(err);
            } else {
                add();
            }
        });
    }
}

/* GET art data. */
router.get('/:id', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    common.checkExist('art', req.params.id, (err, id) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (id) {
                common.getItem('art', id, (err, data) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        if (data.Item) {
                            res.json(data.Item);
                        } else {
                            res.json({});
                        }
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

/* Batch GET art data. */
router.post('/batch', [
    body('id').isArray().isLength({min: 1}),
    body('id.*').isInt().isLength({min: 8, max: 8})
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    common.batchGetItems('art', req.body.id, function (err, data) {
        /* istanbul ignore if */
        if (err) {
            next(err);
        }
        else {
            res.json(data.Responses.art.reduce((result, item) => {
                result[item.id] = item; //a, b, c
                return result;
            }, {}));
        }
    });
});

/* GET art relations. */
router.get('/:id/artizen', [
    oneOf([
        param('id').isInt().isLength({min: 8, max: 8}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    query('type').optional().matches(/^[a-z][a-z-]*[a-z]$/)
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    // Check art exists
    common.checkExist('art', req.params.id, (err, id) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (id) {
                // Get artizen id and type from Aurora table `archive`
                let sql, parameters;
                if (req.query.type) {
                    sql = 'SELECT * FROM archive WHERE art_id=? AND type=? ORDER BY artizen_id DESC';
                    parameters = [parseInt(id), req.query.type];
                } else {
                    sql = 'SELECT * FROM archive WHERE art_id=? ORDER BY artizen_id DESC';
                    parameters = [parseInt(id)];
                }
                rds.query(sql, parameters, (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        if (result.length) {
                            // Get artizen ids and remove duplicate
                            const artizen_ids = result.map(item => item.artizen_id)
                                .filter((item, index, array) => (!index || item !== array[index - 1]))
                                .map(item => ({id: parseInt(item)}));

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
                            dynamodb.batchGet(params, (err, data) => {
                                /* istanbul ignore if */
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
                                    result = Object.keys(result).map(key => ({type: key, data: result[key]}));
                                    res.json(result);
                                }
                            });
                        } else {
                            // No relations found
                            res.json([]);
                        }
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
router.put('/:username', [
    oneOf([
        [
            param('username').custom(common.validateUsername).withMessage('Invalid username'),
            body('username').custom((value, {req}) => (value === req.params.username)).withMessage('Unequal usernames')],
        [
            param('username').equals('00000000'),
            body('username').not().exists()
        ]
    ]),
    body('id').not().exists(),
    body('title.default').isLength({min: 1}),
    body('relations').isArray(),
    body('relations').isLength({min: 1}),
    body('relations.*.artizen').exists().custom(common.validateUsername).withMessage('Invalid relation username'),
    body('relations.*.type').exists().matches(/^[a-z][a-z-]*[a-z]$/).withMessage('Invalid relation type')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let relations = req.body.relations;
    const usernames = relations.map(relation => relation.artizen);
    // Check if all artizen username exist in DynamoDB table `artizen`
    checkArtizens(usernames, (err, exists) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            const allExist = Object.keys(exists).every(k => exists[k]);
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
                // Insert username of art into Aurora table `art`
                common.insertItem('art', req.params.username, (err, result, fields) => {
                    if (err) {
                        /* istanbul ignore else */
                        if (err.code === 'ER_DUP_ENTRY') {
                            res.status(400).json({
                                code: 'USERNAME_EXIST',
                                message: `Username already exists: ${req.params.username}`
                            });
                        } else {
                            next(err);
                        }
                    } else {
                        const id = result[0].id;
                        const art = Object.assign(_.omit(req.body, 'relations'), {id: parseInt(id)});
                        // Put art into DynamoDB table `art`
                        common.putItem('art', art, (err, data) => {
                            /* istanbul ignore if */
                            if (err) {
                                next(err);
                            } else {
                                // Add types to artizen data in DynamoDB table `artizen`
                                addTypes(relations, (err) => {
                                    /* istanbul ignore if */
                                    if (err) {
                                        next(err);
                                    } else {
                                        // Insert art's relations with artizens into Aurora table `archive`
                                        rds.query('INSERT INTO archive (art_id, artizen_id, type) VALUES ?',
                                            [relations.map(relation => [parseInt(id), parseInt(relation.artizen), relation.type])],
                                            (err, result, fields) => {
                                                /* istanbul ignore if */
                                                if (err) {
                                                    next(err);
                                                } else {
                                                    res.json({
                                                        message: `PUT art success: ${req.params.username}`,
                                                        id: parseInt(art.id),
                                                        username: art.username
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
});

/* DELETE art relations, data, username. */
router.delete('/:id', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    common.checkExist('art', req.params.id, (err, id) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (id) {
                // Delete art id and relations from Aurora table `art` and `archive`
                rds.query('DELETE FROM art WHERE id=?', [parseInt(id)], (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        // Delete art data from DynamoDB
                        common.deleteItem('art', id, (err, data) => {
                            /* istanbul ignore if */
                            if (err) {
                                next(err);
                            } else {
                                res.json({
                                    message: `DELETE art success: ${req.params.id}`
                                });
                            }
                        });
                    }
                });
            } else {
                res.json({
                    message: `Art not found: ${req.params.id}`
                });
            }
        }
    });
});

/* POST art introduction. */
router.post('/:id/introduction', [
    param('id').isInt().isLength({min: 8, max: 8}),
    body('author_id').exists().isInt().isLength({min: 9, max: 9}),
    body('rating').not().exists(),
    body('content').exists().isLength({min: 1})
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const language = common.detectLanguage(req.body.content);
    rds.query('INSERT INTO text (author_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(req.body.author_id), parseInt(req.params.id), null, 0, null, req.body.content, language, 0]], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', (err, result, fields) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    const id = result[0].id;
                    res.json({
                        id: parseInt(id),
                        message: `Insert introduction success: ${req.params.id} ${id}`
                    });
                }
            });
        }
    });
});

/* POST art review. */
router.post('/:id/review', [
    param('id').isInt().isLength({min: 8, max: 8}),
    body('author_id').exists().isInt().isLength({min: 9, max: 9}),
    body('content').optional().isLength({min: 1}),
    oneOf([
        body('rating').exists().isInt({min: 1, max: 5}),
        body('content').exists().isLength({min: 1})
    ])
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const language = common.detectLanguage(req.body.content);
    rds.query('INSERT INTO text (author_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(req.body.author_id), parseInt(req.params.id), null, 1, parseInt(req.body.rating) ? parseInt(req.body.rating) : null, req.body.content, language, 1]], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', (err, result, fields) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    const id = result[0].id;
                    res.json({
                        id: parseInt(id),
                        message: `Insert review success: ${req.params.id} ${id}`
                    });
                }
            });
        }
    });
});

module.exports = router;
