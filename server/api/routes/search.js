require('dotenv').config();
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const request = require('request');
const {query, body, validationResult} = require('express-validator/check');
const microtime = require('microtime');
const common = require('./common');
const s3 = common.s3;
const rds = common.rds;
const {auth} = require('./auth.config');

/* GET text search results. */
router.get('/', [
    query('q').exists().isLength({min: 1}),
    query('from').optional().isInt(),
], function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const query = req.query.q;
    const from = req.query.from || 0;
    const size = 10;
    const results = {
        'art': [],
        'artizen': [],
    };

    const search = _.after(Object.keys(results).length, () => {
        results.next = `${process.env.API_ENDPOINT}/search?q=${encodeURIComponent(query)}&from=${from + size}`;
        res.json(results);
    });

    for (let index in results) {
        request.post({
            url: `${process.env.ES_HOST}/${index}/_search`,
            body: {
                'from': from,
                '_source': {
                    'excludes': ['image.*.simple_word_*', 'image.*.signature']
                },
                'size': 10,
                'query': {
                    'bool': {
                        'should': [
                            {
                                'multi_match': {
                                    'query': query,
                                    'fields': ['title.*', 'artist.*', 'museum.*', 'genre.*', 'style.*', 'name.*'],
                                    'fuzziness': 'AUTO',
                                    'prefix_length': 0,
                                    'operator': 'and'
                                }
                            },
                            {
                                'multi_match': {
                                    'query': query,
                                    'fields': ['introduction.*'],
                                    'operator': 'and'
                                }
                            },
                            {
                                'multi_match': {
                                    'query': query,
                                    'fields': ['completion_year', 'username'],
                                    'operator': 'and'
                                }
                            }
                        ]
                    }
                },
                'highlight': {
                    'pre_tags': ['<b>'],
                    'post_tags': ['</b>'],
                    'fields': {
                        'title.*': {'number_of_fragments': 0},
                        'artist.*': {'number_of_fragments': 0},
                        'museum.*': {'number_of_fragments': 0},
                        'genre.*': {'number_of_fragments': 0},
                        'style.*': {'number_of_fragments': 0},
                        'name.*': {'number_of_fragments': 0},
                        'username': {'number_of_fragments': 0},
                        'introduction.*': {'number_of_fragments': 3, 'fragment_size': 150}
                    }
                }
            },
            json: true
        }, (error, response, body) => {
            /* istanbul ignore if */
            if (error || !(response && response.statusCode === 200)) {
                res.status(500).json({
                    code: 'ES_ERROR',
                    message: 'Error in Elasticsearch service'
                });
            } else {
                results[index] = body.hits.hits.map(item => Object.assign(item._source, {
                    _score: item._score,
                    _highlight: item.highlight
                }));
                search();
            }
        });
    }
});

/* GET image search results. */
router.post('/', [
    body('image').exists(),
], auth.optional, function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const artizenId = req.payload && req.payload.id;

    request.post({
        url: 'http://localhost:5000/aura',
        body: req.body,
        json: true
    }, (error, response, body) => {
        /* istanbul ignore if */
        if (error || !(response && response.statusCode === 200)) {
            res.status(500).json({
                code: 'AURA_ERROR',
                message: 'Error in Aura image search'
            });
        } else {
            res.json(Object.assign(body, {artizen: []}));

            const buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const filename = `${microtime.now()}.jpg`;
            const path = `aura/${filename}`;
            const artId = body.art && body.art[0] && body.art[0].id;
            var data = {
                Key: path,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            s3.putObject(data, function (err, data) {
                /* istanbul ignore else */
                if (!err) {
                    rds.query('INSERT INTO aura (image, art_id, artizen_id) VALUES (?)', [[filename, artId, artizenId]]);
                }
            });
        }
    });
});

module.exports = router;
