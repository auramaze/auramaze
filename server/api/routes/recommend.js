require('dotenv').config();
const express = require('express');
const router = express.Router();
const request = require('request');
const {query, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const {auth} = require('./auth.config');

/* GET recommendations. */
router.get('/', [
    query('from').optional().isInt(),
], auth.required, function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    let results = {data: [], next: null};

    rds.query('SELECT art_id FROM history WHERE user_id=? AND art_id IS NOT NULL ORDER BY id DESC LIMIT 50', [id], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            if (result.length) {
                const art_ids_50 = result.map(item => item.art_id);
                const art_ids_10 = art_ids_50.slice(0, 10);
                rds.query('SELECT DISTINCT artizen.* FROM artizen INNER JOIN archive ON artizen.id=archive.artizen_id WHERE archive.art_id IN (?)', [art_ids_10], (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        next(err);
                    } else {
                        if (result.length) {
                            const q = result.map(item => item.name && item.name.default).join(' ');
                            request.post({
                                url: `${process.env.ES_HOST}/art/_search`,
                                body: {
                                    'from': req.query.from,
                                    '_source': {
                                        'excludes': ['image.*.simple_word_*', 'image.*.signature']
                                    },
                                    'size': 50,
                                    'query': {
                                        'bool': {
                                            'must': {
                                                'multi_match': {
                                                    'query': q,
                                                    'fields': ['artist.*', 'museum.*', 'genre.*', 'style.*'],
                                                    'operator': 'or'
                                                }
                                            },
                                            'must_not': art_ids_50.map(id => ({
                                                'term': {
                                                    'id': id
                                                }
                                            }))
                                        }
                                    }
                                },
                                json: true
                            }, (error, response, body) => {
                                /* istanbul ignore if */
                                if (error || !(response && response.statusCode === 200)) {
                                    res.status(500).json({
                                        code: 'ES_ERROR',
                                        message: 'Error in recommender system'
                                    });
                                } else {
                                    results.data = shuffle(body.hits.hits).slice(0, 10).map(item => Object.assign(item._source, {
                                        _score: item._score,
                                    }));
                                    res.json(results);
                                }
                            });
                        } else {
                            res.json(results);
                        }
                    }
                });
            } else {
                res.json(results);
            }
        }
    });
});


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = router;
