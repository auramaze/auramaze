const express = require('express');
const router = express.Router();
const common = require('./common');
const dynamodb = common.dynamodb;
const rds = common.rds;
const {param, query, body, oneOf, validationResult} = require('express-validator/check');

/* GET artizen data. */
router.get('/:id', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    common.getItem('artizen', req.params.id, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                let artizen = data.Items[0];
                // Convert type set to array
                if (artizen.type) {
                    artizen.type = artizen.type.values;
                }
                res.json(artizen);
            } else {
                res.status(404).json({
                    code: 'ARTIZEN_NOT_FOUND',
                    message: `Artizen not found: ${req.params.id}`
                });
            }
        }
    });
});

/* GET artizen relations. */
router.get('/:id/art', [
    oneOf([
        param('id').isInt().isLength({min: 9, max: 9}),
        param('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    query('type').optional().matches(/^[a-z][a-z-]*[a-z]$/)
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const page = parseInt(req.query.page) >= 0 ? parseInt(req.query.page) : 0;
    const size = 20;

    // Check artizen exists
    common.getItem('artizen', req.params.id, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                // Get all available types
                rds.query('SELECT DISTINCT type FROM archive WHERE artizen_id=?', [parseInt(data.Items[0].id)], (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        // Get art id and type from Aurora table `archive`
                        let sql, parameters;
                        if (req.query.type) {
                            sql = 'SELECT * FROM archive WHERE artizen_id=? AND type=? ORDER BY art_id DESC LIMIT ? OFFSET ?';
                            parameters = [parseInt(data.Items[0].id), req.query.type, size, page * size];
                        } else {
                            if (result.length) {
                                const types = result.map(item => item.type);
                                sql = Array(types.length).fill('(SELECT * FROM archive WHERE artizen_id=? AND type=? ORDER BY art_id DESC LIMIT ? OFFSET ?)').join(' UNION ALL ') + ' ORDER BY art_id DESC';
                                parameters = [];
                                for (let type of types) {
                                    parameters.push(parseInt(data.Items[0].id), type, size, page * size);
                                }
                            } else {
                                // Artizen not in archive
                                sql = 'SELECT * FROM archive WHERE artizen_id=? ORDER BY art_id DESC LIMIT ? OFFSET ?';
                                parameters = [parseInt(data.Items[0].id), size, page * size];
                            }
                        }
                        rds.query(sql, parameters, (err, result, fields) => {
                            /* istanbul ignore if */
                            if (err) {
                                next(err);
                            } else {
                                if (result.length) {
                                    // Get art ids and remove duplicate
                                    const art_ids = result.map(item => item.art_id).filter((item, index, array) => {
                                        return !index || item !== array[index - 1];
                                    }).map(item => ({id: parseInt(item)}));

                                    // Get other attributes from DynamoDB table `art`
                                    const params = {
                                        RequestItems: {
                                            'art': {
                                                Keys: art_ids,
                                                ProjectionExpression: '#id, #title, #image',
                                                ExpressionAttributeNames: {
                                                    '#id': 'id',
                                                    '#title': 'title',
                                                    '#image': 'image'
                                                }
                                            }
                                        },
                                    };
                                    dynamodb.batchGet(params, (err, data) => {
                                        /* istanbul ignore if */
                                        if (err) {
                                            next(err);
                                        } else {
                                            data = data.Responses.art;

                                            // Convert data to dict
                                            const art_dict = data.reduce((acc, cur) => {
                                                acc[cur.id.toString()] = cur;
                                                return acc;
                                            }, {});

                                            // Add DynamoDB data to Aurora results
                                            result = result.map(item => Object.assign({type: item.type}, {data: art_dict[item.art_id.toString()]}));

                                            // Group by type
                                            result = result.reduce((acc, cur) => {
                                                (acc[cur.type] = acc[cur.type] || []).push(cur.data);
                                                return acc;
                                            }, {});

                                            // Convert object to array
                                            result = Object.keys(result).map(key => ({
                                                type: key,
                                                data: result[key],
                                                next: `/${req.params.id}/art?type=${key}&page=${page + 1}`
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
                    }
                });
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
router.put('/:username', [
    param('username').custom(common.validateUsername).withMessage('Invalid username'),
    body('username').custom((value, {req}) => (value === req.params.username)).withMessage('Unequal usernames'),
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
    // Insert username of art into Aurora table `username`
    common.insertUsername(req.params.username, (err, result, fields) => {
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
            // Increment id in Aurora table `artizen_id`
            common.incrementId('artizen', (err, result, fields) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    const id = result[0].id;
                    let artizen = Object.assign(req.body, {id: parseInt(id)});
                    // Convert artizen type to set of strings
                    if (artizen.type) {
                        artizen.type = dynamodb.createSet(artizen.type);
                    }
                    // Put artizen into DynamoDB table `artizen`
                    common.putItem('artizen', artizen, (err, data) => {
                        /* istanbul ignore if */
                        if (err) {
                            next(err);
                        } else {
                            res.json({
                                message: `PUT artizen success: ${req.params.username}`,
                                id: parseInt(artizen.id),
                                username: artizen.username
                            });
                        }
                    });
                }
            });
        }
    });
});

/* DELETE artizen relations, data, username. */
router.delete('/:id', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    common.getItem('artizen', req.params.id, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (data.Count) {
                const id = data.Items[0].id;
                const username = data.Items[0].username;
                // Delete artizen id and relations from Aurora table `artizen` and `archive`
                rds.query('DELETE FROM artizen WHERE id=?', [parseInt(id)], (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        // Delete artizen data from DynamoDB
                        common.deleteItem('artizen', id, (err, data) => {
                            /* istanbul ignore if */
                            if (err) {
                                next(err);
                            } else {
                                if (username) {
                                    // Delete artizen username from Aurora table `username`
                                    common.deleteUsername(username, (err, result, fields) => {
                                        /* istanbul ignore if */
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.json({
                                                message: `DELETE artizen success: ${req.params.id}`
                                            });
                                        }
                                    });
                                } else {
                                    res.json({
                                        message: `DELETE artizen success: ${req.params.id}`
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                res.json({
                    message: `Artizen not found: ${req.params.id}`
                });
            }
        }
    });
});

/* POST artizen introduction. */
router.post('/:id/introduction', [
    param('id').isInt().isLength({min: 9, max: 9}),
    body('author_id').exists().isInt().isLength({min: 9, max: 9}),
    body('rate').not().exists(),
    body('content').exists().isLength({min: 1})
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const language = common.detectLanguage(req.body.content);
    rds.query('INSERT INTO text (author_id, art_id, artizen_id, type, rate, content, language, valid) VALUES (?)', [[parseInt(req.body.author_id), null, parseInt(req.params.id), 0, null, req.body.content, language, 0]], (err, result, fields) => {
        if (err) {
            next(err);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', (err, result, fields) => {
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

module.exports = router;
