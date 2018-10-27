const express = require('express');
const router = express.Router();
const common = require('./common');
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

    common.getItem('artizen', req.params.id, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                res.json(result[0]);
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
    query('type').optional().matches(/^[a-z][a-z-]*[a-z]$/)
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const page = parseInt(req.query.page) >= 0 ? parseInt(req.query.page) : 0;
    const size = 20;

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
                if (req.query.type) {
                    sql = 'SELECT art.id, art.username, art.title, art.image, archive.type FROM archive INNER JOIN art ON archive.art_id=art.id WHERE artizen_id=? AND type=? ORDER BY art.username LIMIT ? OFFSET ?';
                    parameters = [parseInt(id), req.query.type, size, page * size];
                } else {
                    const types = result.map(item => item.type);
                    sql = Array(types.length).fill('(SELECT art.id, art.username, art.title, art.image, archive.type FROM archive INNER JOIN art ON archive.art_id=art.id WHERE artizen_id=? AND type=? ORDER BY art.username LIMIT ? OFFSET ?)').join(' UNION ALL ');
                    parameters = [];
                    for (let type of types) {
                        parameters.push(parseInt(id), type, size, page * size);
                    }
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
        /* istanbul ignore if */
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
            const id = result[0].id;
            res.json({
                message: `PUT artizen success: ${req.params.username}`,
                id: parseInt(id),
                username: req.body.username
            });
        }
    });
});

/* DELETE artizen data and relations. */
router.delete('/:id', oneOf([
    param('id').isInt().isLength({min: 9, max: 9}),
    param('id').custom(common.validateUsername).withMessage('Invalid username')
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    common.deleteItem('artizen', req.params.id, (err, data) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json({
                message: `DELETE artizen success: ${req.params.id}`
            });
        }
    });
});

/* GET artizen introduction. */
router.get('/:id/introduction', [
    param('id').isInt().isLength({min: 9, max: 9}),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    rds.query('SELECT text.*, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text LEFT JOIN vote ON text.id=vote.text_id WHERE text.artizen_id=(?) AND type=0 AND valid GROUP BY text.id', [req.params.id], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* POST artizen introduction. */
router.post('/:id/introduction', [
    param('id').isInt().isLength({min: 9, max: 9}),
    body('author_id').exists().isInt().isLength({min: 9, max: 9}),
    body('rating').not().exists(),
    body('content.blocks').exists()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const language = req.body.content ? common.detectLanguage(req.body.content) : null;
    rds.query('INSERT INTO text (author_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(req.body.author_id), null, parseInt(req.params.id), 0, null, req.body.content ? JSON.stringify(req.body.content) : null, language, 0]], (err, result, fields) => {
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

/* GET artizen review. */
router.get('/:id/review', [
    param('id').isInt().isLength({min: 9, max: 9}),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    rds.query('SELECT text.*, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text LEFT JOIN vote ON text.id=vote.text_id WHERE text.artizen_id=(?) AND type=1 AND valid GROUP BY text.id', [req.params.id], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

/* POST artizen review. */
router.post('/:id/review', [
    param('id').isInt().isLength({min: 9, max: 9}),
    body('author_id').exists().isInt().isLength({min: 9, max: 9}),
    oneOf([
        body('content').not().exists(),
        body('content.blocks').exists()
    ]),
    oneOf([
        body('rating').exists().isInt({min: 1, max: 5}),
        body('content.blocks').exists()
    ])
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const language = req.body.content ? common.detectLanguage(req.body.content) : null;
    rds.query('INSERT INTO text (author_id, art_id, artizen_id, type, rating, content, language, valid) VALUES (?)', [[parseInt(req.body.author_id), null, parseInt(req.params.id), 1, parseInt(req.body.rating) ? parseInt(req.body.rating) : null, req.body.content ? JSON.stringify(req.body.content) : null, language, 1]], (err, result, fields) => {
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

module.exports = router;
