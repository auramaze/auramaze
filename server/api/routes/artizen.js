require('dotenv').config();
const express = require('express');
const router = express.Router();
const {param, query, body, oneOf, validationResult} = require('express-validator/check');
const crypto = require('crypto');
const common = require('./common');
const rds = common.rds;
const s3 = common.s3;
const {auth} = require('./auth.config');

/* GET artizen data. */
router.get('/:id', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const userId = req.payload && req.payload.id;

    common.getItem('artizen', req.params.id, userId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                res.json(result[0]);
                if (userId) {
                    common.insertHistory(userId, 'artizen', result[0].id);
                }
            } else {
                res.status(404).json({
                    code: 'ARTIZEN_NOT_FOUND',
                    message: `Artizen not found: ${req.params.id}`
                });
            }
        }
    });
});

/* Batch GET artizen data. */
router.post('/batch', [
    body('id').isArray(),
    body('id.*').isInt().isLength({min: 9, max: 9})
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    if (req.body.id.length > 0) {
        common.batchGetItems('artizen', req.body.id, function (err, data) {
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

/* GET artizen relations. */
router.get('/:id/art', [
    oneOf([
        param('id').isInt().isLength({min: 9, max: 9}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    query('type').optional().matches(/^[a-z][a-z-]*[a-z]$/),
    query('from').optional().isInt()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const from = parseInt(req.query.from) > 0 ? parseInt(req.query.from) : 0;
    const size = 10;
    const total = {};

    // Get all available types
    rds.query(`SELECT artizen.id, archive.type FROM archive INNER JOIN artizen ON archive.artizen_id=artizen.id WHERE artizen.${isNaN(parseInt(req.params.id)) ? 'username' : 'id'}=? GROUP BY archive.type`, [isNaN(parseInt(req.params.id)) ? req.params.id.toString() : parseInt(req.params.id)], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                const id = result[0].id;
                // Get art id and type from Aurora table `archive`
                let sql, parameters;
                let multitype = false;
                let types = [];
                if (req.query.type) {
                    types = [req.query.type];
                    sql = 'SELECT SQL_CALC_FOUND_ROWS art.id, art.username, art.title, art.image, archive.type FROM archive INNER JOIN art ON archive.art_id=art.id WHERE artizen_id=? AND type=? ORDER BY art.username LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;';
                    parameters = [parseInt(id), req.query.type, size, from];
                } else {
                    types = result.map(item => item.type);
                    if (types.length > 1) {
                        multitype = true;
                    }
                    sql = Array(types.length).fill('SELECT SQL_CALC_FOUND_ROWS art.id, art.username, art.title, art.image, archive.type FROM archive INNER JOIN art ON archive.art_id=art.id WHERE artizen_id=? AND type=? ORDER BY art.username LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;').join(' ');
                    parameters = [];
                    for (let type of types) {
                        parameters.push(parseInt(id), type, size, from);
                    }
                }
                rds.query(sql, parameters, (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        if (multitype) {
                            result.filter((item, index) => index % 2 === 1).forEach((item, index) => {
                                total[types[index]] = item[0].total;
                            });
                            // Merge multiple query results
                            result = [].concat.apply([], result.filter((item, index) => index % 2 === 0));
                        } else {
                            total[types[0]] = result[1][0].total;
                            result = result[0];
                        }

                        // Group by type
                        result = result.reduce((acc, cur) => {
                            (acc[cur.type] = acc[cur.type] || []).push(cur);
                            return acc;
                        }, {});

                        // Convert object to array
                        result = Object.keys(result).map(key => ({
                            type: key,
                            data: result[key],
                            next: from + size < total[key] ? `${process.env.API_ENDPOINT}/artizen/${req.params.id}/art?type=${key}&from=${from + size}` : null
                        }));
                        res.json(result);
                    }
                });
            } else {
                // No relations found
                res.json([]);
            }
        }
    });
});

/* PUT artizen data. */
router.put('/:username', [
    oneOf([
        [
            param('username').custom(common.validateUsername).withMessage('Invalid username'),
            body('username').custom((value, {req}) => (value === req.params.username)).withMessage('Unequal usernames')],
        [
            param('username').equals('000000000'),
            body('username').not().exists()
        ]
    ]),
    body('id').not().exists(),
    body('name.default').isLength({min: 1}),
    oneOf([
        body('type').isArray().isLength({min: 1}),
        body('type').not().exists()
    ])
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    common.putItem('artizen', req.body, (err, result, fields) => {
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
            res.json({
                message: `PUT artizen success: ${req.params.username}`,
                id: parseInt(id),
                username: req.body.username
            });
        }
    });
});

/* Update artizen data. */
router.post('/:id', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let id = req.params.id;
    const authId = req.payload && req.payload.id;

    if (parseInt(id) !== parseInt(authId)) {
        res.status(403).json({
            code: 'UPDATE_FORBIDDEN',
            message: `Update forbidden: ${req.params.id}`
        });
    } else {
        let condition;
        if (isNaN(parseInt(id))) {
            condition = 'WHERE username=?';
            id = id.toString();
        } else {
            condition = 'WHERE id=?';
            id = parseInt(id);
        }

        if (req.body.avatar_image) {
            const path = `avatars/${req.params.id}_${crypto.createHash('md5').update(req.body.avatar_image).digest('hex')}.jpg`;
            const buf = new Buffer(req.body.avatar_image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            var data = {
                Key: path,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };
            s3.putObject(data, (err, data) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    req.body.avatar = `${process.env.AWS_S3_HOST}/${process.env.AWS_S3_BUCKET}/${path}`;
                    if (req.body.old_password) {
                        rds.query(`SELECT salt, hash FROM artizen ${condition}`, [id], (err, result, fields) => {
                            /* istanbul ignore if */
                            if (err) {
                                next(err);
                            } else {
                                const {salt, hash} = result[0];
                                if (!common.checkPassword(req.body.old_password, salt, hash)) {
                                    res.status(400).json({
                                        code: 'WRONG_OLD_PASSWORD',
                                        message: `Wrong old password: ${req.body.old_password}`
                                    });
                                } else {
                                    common.updateItem('artizen', req.params.id, req.body, (err, data) => {
                                        /* istanbul ignore if */
                                        if (err) {
                                            /* istanbul ignore else */
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                const key = err.sqlMessage.match(/for key '(\w+)'$/i)[1];
                                                res.status(400).json({
                                                    code: `${key.toUpperCase()}_EXIST`,
                                                    message: `${key} already exists: ${req.body[key]}`
                                                });
                                            } else {
                                                next(err);
                                            }
                                        } else {
                                            res.json({
                                                message: `Update artizen success: ${req.params.id}`
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        common.updateItem('artizen', req.params.id, req.body, (err, data) => {
                            /* istanbul ignore if */
                            if (err) {
                                /* istanbul ignore else */
                                if (err.code === 'ER_DUP_ENTRY') {
                                    const key = err.sqlMessage.match(/for key '(\w+)'$/i)[1];
                                    res.status(400).json({
                                        code: `${key.toUpperCase()}_EXIST`,
                                        message: `${key} already exists: ${req.body[key]}`
                                    });
                                } else {
                                    next(err);
                                }
                            } else {
                                res.json({
                                    message: `Update artizen success: ${req.params.id}`
                                });
                            }
                        });
                    }
                }
            });
        } else {
            if (req.body.old_password) {
                rds.query(`SELECT salt, hash FROM artizen ${condition}`, [id], (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        const {salt, hash} = result[0];
                        if (!common.checkPassword(req.body.old_password, salt, hash)) {
                            res.status(400).json({
                                code: 'WRONG_OLD_PASSWORD',
                                message: `Wrong old password: ${req.body.old_password}`
                            });
                        } else {
                            common.updateItem('artizen', req.params.id, req.body, (err, data) => {
                                /* istanbul ignore if */
                                if (err) {
                                    /* istanbul ignore else */
                                    if (err.code === 'ER_DUP_ENTRY') {
                                        const key = err.sqlMessage.match(/for key '(\w+)'$/i)[1];
                                        res.status(400).json({
                                            code: `${key.toUpperCase()}_EXIST`,
                                            message: `${key} already exists: ${req.body[key]}`
                                        });
                                    } else {
                                        next(err);
                                    }
                                } else {
                                    res.json({
                                        message: `Update artizen success: ${req.params.id}`
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                common.updateItem('artizen', req.params.id, req.body, (err, data) => {
                    /* istanbul ignore if */
                    if (err) {
                        /* istanbul ignore else */
                        if (err.code === 'ER_DUP_ENTRY') {
                            const key = err.sqlMessage.match(/for key '(\w+)'$/i)[1];
                            res.status(400).json({
                                code: `${key.toUpperCase()}_EXIST`,
                                message: `${key} already exists: ${req.body[key]}`
                            });
                        } else {
                            next(err);
                        }
                    } else {
                        res.json({
                            message: `Update artizen success: ${req.params.id}`
                        });
                    }
                });
            }
        }
    }
});

// /* DELETE artizen data and relations. */
// router.delete('/:id', oneOf([
//     param('id').isInt().isLength({min: 9, max: 9}),
//     param('id').custom(common.validateUsername).withMessage('Invalid username')
// ]), (req, res, next) => {
//     const errors = validationResult(req);
//     if (!validationResult(req).isEmpty()) {
//         return res.status(400).json({errors: errors.array()});
//     }
//
//     common.deleteItem('artizen', req.params.id, (err, data) => {
//         /* istanbul ignore if */
//         if (err) {
//             next(err);
//         } else {
//             res.json({
//                 message: `DELETE artizen success: ${req.params.id}`
//             });
//         }
//     });
// });

/* Get all followees of an artizen. */
router.get('/:id/follow', [
    oneOf([
        param('id').isInt().isLength({min: 9, max: 9}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    oneOf([
        query('group').equals('art'),
        query('group').equals('artizen'),
    ]),
    query('from').optional().isInt()
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const from = parseInt(req.query.from) > 0 ? parseInt(req.query.from) : 0;
    const size = 10;

    let sql;

    if (req.query.group === 'art') {
        if (isNaN(parseInt(req.params.id))) {
            sql = 'SELECT SQL_CALC_FOUND_ROWS follow.*, art.username, art.title, art.image FROM follow INNER JOIN art ON follow.art_id=art.id INNER JOIN artizen AS user ON follow.user_id=user.id WHERE user.username=? ORDER BY follow.id DESC LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;';
        } else {
            sql = 'SELECT SQL_CALC_FOUND_ROWS follow.*, art.username, art.title, art.image FROM follow INNER JOIN art ON follow.art_id=art.id WHERE follow.user_id=? ORDER BY follow.id DESC LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;';
        }
    } else {
        if (isNaN(parseInt(req.params.id))) {
            sql = 'SELECT SQL_CALC_FOUND_ROWS follow.*, artizen.username, artizen.name, artizen.avatar FROM follow INNER JOIN artizen ON follow.artizen_id=artizen.id INNER JOIN artizen AS user ON follow.user_id=user.id WHERE user.username=? ORDER BY follow.id DESC LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;';
        } else {
            sql = 'SELECT SQL_CALC_FOUND_ROWS follow.*, artizen.username, artizen.name, artizen.avatar FROM follow INNER JOIN artizen ON follow.artizen_id=artizen.id WHERE follow.user_id=? ORDER BY follow.id DESC LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;';
        }
    }

    rds.query(sql, [req.params.id, size, from], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            const total = result[1][0].total;
            result = result[0];
            res.json({
                data: result,
                next: from + size < total ? `${process.env.API_ENDPOINT}/artizen/${req.params.id}/follow?group=${req.query.group}&from=${from + size}` : null
            });
        }
    });
});

/* Follow an artizen. */
router.post('/:id/follow', [
    param('id').isInt().isLength({min: 9, max: 9}),
    body('type').isBoolean()
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    if (parseInt(id) === parseInt(req.params.id)) {
        return res.status(400).json({
            code: 'SELF_FOLLOW',
            message: `Artizens cannot follow themselves: ${req.params.id}`
        });
    }

    let sql, parameters;

    if (req.body.type) {
        sql = 'DELETE FROM follow WHERE user_id=? AND artizen_id=?; REPLACE INTO follow (user_id, artizen_id) VALUES (?);';
        parameters = [id, req.params.id, [id, req.params.id]];
    } else {
        sql = 'DELETE FROM follow WHERE user_id=? AND artizen_id=?';
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

/* GET all introductions of artizen. */
router.get('/:id/introduction', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
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

    common.getTexts('artizen', req.params.id, 0, from, size, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* GET one introduction of artizen. */
router.get('/:id/introduction/:textId', [
    oneOf([
        param('id').isInt().isLength({min: 9, max: 9}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    param('textId').isInt().isLength({min: 10, max: 10}),
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const authId = req.payload && req.payload.id;

    common.getText('artizen', req.params.id, 0, req.params.textId, authId, (err, result, fields) => {
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

/* POST artizen introduction. */
router.post('/:id/introduction', [
    param('id').isInt().isLength({min: 9, max: 9}),
    body('rating').not().exists(),
    body('content.blocks').exists()
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const language = req.body.content ? common.detectLanguage(req.body.content) : null;
    rds.query('INSERT INTO text (user_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(id), null, parseInt(req.params.id), 0, null, req.body.content ? JSON.stringify(req.body.content) : null, language, 0]], (err, result, fields) => {
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

/* Vote for one introduction of artizen. */
router.post('/:id/introduction/:textId/vote', [
    param('id').isInt().isLength({min: 9, max: 9}),
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

/* GET all reviews of artizen. */
router.get('/:id/review', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
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

    common.getTexts('artizen', req.params.id, 1, from, size, authId, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* GET one review of artizen. */
router.get('/:id/review/:textId', [
    oneOf([
        param('id').isInt().isLength({min: 9, max: 9}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    param('textId').isInt().isLength({min: 10, max: 10}),
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const authId = req.payload && req.payload.id;

    common.getText('artizen', req.params.id, 1, req.params.textId, authId, (err, result, fields) => {
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

/* POST artizen review. */
router.post('/:id/review', [
    param('id').isInt().isLength({min: 9, max: 9}),
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
    rds.query('INSERT INTO text (user_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(id), null, parseInt(req.params.id), 1, parseInt(req.body.rating) ? parseInt(req.body.rating) : null, req.body.content ? JSON.stringify(req.body.content) : null, language, 1]], (err, result, fields) => {
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

/* Vote for one review of artizen. */
router.post('/:id/review/:textId/vote', [
    param('id').isInt().isLength({min: 9, max: 9}),
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

/* GET artizen activities. */
router.get('/:id/activity', [
    query('max').optional().isInt()
], auth.required, function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const max = parseInt(req.query.max) >= 0 ? parseInt(req.query.max) : Number.MAX_SAFE_INTEGER;

    rds.query('SELECT SQL_CALC_FOUND_ROWS text.*, author.id AS author_id, author.username AS author_username, author.name AS author_name, author.avatar AS author_avatar, art.username AS art_username, art.title AS art_title, art.image AS art_image, artizen.username AS artizen_username, artizen.name AS artizen_name, artizen.avatar AS artizen_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT vote.status FROM vote WHERE vote.text_id=text.id AND vote.user_id=?) AS status FROM text INNER JOIN artizen AS author ON text.user_id=author.id LEFT JOIN art ON text.art_id=art.id LEFT JOIN artizen AS artizen ON text.artizen_id=artizen.id LEFT JOIN vote ON text.id=vote.text_id WHERE text.user_id=? AND text.valid=1 AND text.id<=? GROUP BY text.id ORDER BY text.id DESC LIMIT 10; SELECT FOUND_ROWS() AS total;', [id, req.params.id, max], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            const response = {data: result[0], next: null};

            if (result[0].length < result[1][0].total && result[0].length) {
                const nextMax = result[0][result[0].length - 1].id - 1;
                response.next = `${process.env.API_ENDPOINT}/artizen/${req.params.id}/activity?max=${nextMax}`;
            }
            res.json(response);
        }
    });
});

module.exports = router;
