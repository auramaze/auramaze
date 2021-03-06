const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {param, query, body, oneOf, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const {auth} = require('./auth.config');

// Check if usernames of all artizens exist in table `artizen`
// Return an object with username as key and id/false as value
function checkArtizens(usernames, callback) {
    let exists = {};
    rds.query('SELECT * FROM artizen WHERE username IN (?)', [usernames], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            callback(err, false);
        } else {
            const artizen_dict = result.reduce((acc, cur) => {
                acc[cur.username] = cur.id;
                return acc;
            }, {});
            for (let username of usernames) {
                exists[username] = artizen_dict[username] || false;
            }
            callback(null, exists);
        }
    });
}

// Add types to artizens in table `artizen`
function addTypes(relations, callback) {
    relations = relations.reduce((acc, cur) => {
        // cur.artizen must be id
        (acc[cur.artizen] = acc[cur.artizen] || []).push(cur.type);
        return acc;
    }, {});

    let add = _.after(Object.keys(relations).length, () => {
        callback(null);
    });

    for (let artizen in relations) {
        rds.query('SELECT type FROM artizen WHERE id=?', [parseInt(artizen)], (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                callback(err);
            } else {
                const prevTypes = result[0] && result[0].type || [];
                const newTypes = Array.from(new Set(relations[artizen].concat(prevTypes)));
                if (newTypes.length > prevTypes.length) {
                    rds.query('UPDATE artizen SET type=? WHERE id=?', [JSON.stringify(newTypes), parseInt(artizen)], (err, result, fields) => {
                        /* istanbul ignore if */
                        if (err) {
                            callback(err);
                        } else {
                            add();
                        }
                    });
                } else {
                    add();
                }
            }
        });
    }
}

/* GET art data. */
router.get('/:id', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const userId = req.payload && req.payload.id;

    common.getItem('art', req.params.id, userId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                res.json(result[0]);
                if (userId) {
                    common.insertHistory(userId, 'art', result[0].id);
                }
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
    body('id').isArray(),
    body('id.*').isInt().isLength({min: 8, max: 8})
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    if (req.body.id.length > 0) {
        common.batchGetItems('art', req.body.id, function (err, data) {
            /* istanbul ignore if */
            if (err) {
                next(err);
            }
            else {
                res.json(data.reduce((result, item) => {
                    result[item.id] = item; //a, b, c
                    return result;
                }, {}));
            }
        });
    } else {
        res.json({});
    }
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

    const sql = `SELECT artizen.id, artizen.username, artizen.name, artizen.avatar, archive.type FROM archive INNER JOIN art ON archive.art_id=art.id INNER JOIN artizen ON archive.artizen_id=artizen.id WHERE art.${isNaN(parseInt(req.params.id)) ? 'username' : 'id'}=? ${req.query.type ? 'AND archive.type=? ' : ''}ORDER BY artizen.username`;
    const parameters = [isNaN(parseInt(req.params.id)) ? req.params.id.toString() : parseInt(req.params.id)];
    if (req.query.type) {
        parameters.push(req.query.type);
    }
    rds.query(sql, parameters, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            // Group by type
            result = result.reduce((acc, cur) => {
                (acc[cur.type] = acc[cur.type] || []).push(cur);
                return acc;
            }, {});

            // Convert object to array
            result = Object.keys(result).map(key => ({type: key, data: result[key]}));
            res.json(result);
        }
    });
});

/* PUT art data and relations. */
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
], auth.required, auth.admin, (req, res, next) => {
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
                const art = _.omit(req.body, 'relations');
                common.putItem('art', art, (err, result, fields) => {
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
                                                id: parseInt(id),
                                                username: art.username
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

/* Update art data. */
router.post('/:id', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), auth.required, auth.admin, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    common.updateItem('art', req.params.id, req.body, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json({
                message: `Update art success: ${req.params.id}`
            });
        }
    });
});

/* DELETE art data and relations. */
router.delete('/:id', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), auth.required, auth.admin, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    common.deleteItem('art', req.params.id, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json({
                message: `DELETE art success: ${req.params.id}`
            });
        }
    });
});

/* Follow an art. */
router.post('/:id/follow', [
    param('id').isInt().isLength({min: 8, max: 8}),
    body('type').isBoolean()
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    let sql, parameters;

    if (req.body.type) {
        sql = 'DELETE FROM follow WHERE user_id=? AND art_id=?; REPLACE INTO follow (user_id, art_id) VALUES (?);';
        parameters = [id, req.params.id, [id, req.params.id]];
    } else {
        sql = 'DELETE FROM follow WHERE user_id=? AND art_id=?';
        parameters = [id, req.params.id];
    }

    rds.query(sql, parameters, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json({
                message: `Follow success: ${req.params.id} ${req.body.type}`,
            });
        }
    });
});

/* GET all introductions of art. */
router.get('/:id/introduction', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username'),
    query('from').optional().isInt()
]), auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const from = parseInt(req.query.from) > 0 ? parseInt(req.query.from) : 0;
    const size = 10;
    const authId = req.payload && req.payload.id;

    common.getTexts('art', req.params.id, 0, from, size, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* GET one introduction of art. */
router.get('/:id/introduction/:textId', [
    oneOf([
        param('id').isInt().isLength({min: 8, max: 8}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    param('textId').isInt().isLength({min: 10, max: 10}),
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const authId = req.payload && req.payload.id;

    common.getText('art', req.params.id, 0, req.params.textId, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({
                    code: 'TEXT_NOT_FOUND',
                    message: `Text not found: ${req.params.id} introduction ${req.params.textId}`
                });
            }
        }
    });
});

/* POST art introduction. */
router.post('/:id/introduction', [
    param('id').isInt().isLength({min: 8, max: 8}),
    body('rating').not().exists(),
    body('content.blocks').exists()
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const language = req.body.content ? common.detectLanguage(req.body.content) : null;
    rds.query('INSERT INTO text (user_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(id), parseInt(req.params.id), null, 0, null, req.body.content ? JSON.stringify(req.body.content) : null, language, 0]], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            if (err.code === 'ER_INVALID_JSON_TEXT') {
                res.status(400).json({
                    code: 'INVALID_JSON',
                    message: `Content is not valid JSON: ${req.body.content}`
                });
            } else {
                next(err);
            }
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

/* Vote for one introduction of art. */
router.post('/:id/introduction/:textId/vote', [
    param('id').isInt().isLength({min: 8, max: 8}),
    param('textId').isInt().isLength({min: 10, max: 10}),
    oneOf([
        body('type').equals('up'),
        body('type').equals('down')
    ])
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    common.voteText(req.params.textId, id, req.body.type, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            if (err.code.startsWith('ER_NO_REFERENCED_ROW')) {
                res.status(404).json({
                    code: 'TEXT_NOT_FOUND',
                    message: `Text not found: ${req.params.id} introduction ${req.params.textId}`
                });
            } else {
                next(err);
            }
        } else {
            res.json({
                message: `Vote success: ${req.params.id} introduction ${req.params.textId}`,
            });
        }
    });
});

/* GET all reviews of art. */
router.get('/:id/review', oneOf([
    param('id').isInt().isLength({min: 8, max: 8}),
    param('id').custom(common.validateUsername).withMessage('Invalid username'),
    query('from').optional().isInt()
]), auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const from = parseInt(req.query.from) > 0 ? parseInt(req.query.from) : 0;
    const size = 10;
    const authId = req.payload && req.payload.id;

    common.getTexts('art', req.params.id, 1, from, size, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* GET one review of art. */
router.get('/:id/review/:textId', [
    oneOf([
        param('id').isInt().isLength({min: 8, max: 8}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    param('textId').isInt().isLength({min: 10, max: 10}),
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const authId = req.payload && req.payload.id;

    common.getText('art', req.params.id, 1, req.params.textId, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({
                    code: 'TEXT_NOT_FOUND',
                    message: `Text not found: ${req.params.id} introduction ${req.params.textId}`
                });
            }
        }
    });
});

/* POST art review. */
router.post('/:id/review', [
    param('id').isInt().isLength({min: 8, max: 8}),
    oneOf([
        body('content').not().exists(),
        body('content.blocks').exists()
    ]),
    oneOf([
        body('rating').exists().isInt({min: 1, max: 5}),
        body('content.blocks').exists()
    ])
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const language = req.body.content ? common.detectLanguage(req.body.content) : null;
    rds.query('INSERT INTO text (user_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(id), parseInt(req.params.id), null, 1, parseInt(req.body.rating) ? parseInt(req.body.rating) : null, req.body.content ? JSON.stringify(req.body.content) : null, language, 1]], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            if (err.code === 'ER_INVALID_JSON_TEXT') {
                res.status(400).json({
                    code: 'INVALID_JSON',
                    message: `Content is not valid JSON: ${req.body.content}`
                });
            } else {
                next(err);
            }
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

/* Vote for one review of art. */
router.post('/:id/review/:textId/vote', [
    param('id').isInt().isLength({min: 8, max: 8}),
    param('textId').isInt().isLength({min: 10, max: 10}),
    oneOf([
        body('type').equals('up'),
        body('type').equals('down')
    ])
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    common.voteText(req.params.textId, id, req.body.type, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            if (err.code.startsWith('ER_NO_REFERENCED_ROW')) {
                res.status(404).json({
                    code: 'TEXT_NOT_FOUND',
                    message: `Text not found: ${req.params.id} review ${req.params.textId}`
                });
            } else {
                next(err);
            }
        } else {
            res.json({
                message: `Vote success: ${req.params.id} review ${req.params.textId}`,
            });
        }
    });
});

module.exports = router;
