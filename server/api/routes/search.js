require('dotenv').config();
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const request = require('request');
/* GET search results. */
router.get('/', function (req, res, next) {
    let results = {'art': [], 'artizen': []};

    const search = _.after(Object.keys(results).length, () => {
        res.json(results);
    });

    for (let index in results) {
        request.get({
            url: `${process.env.ESROOT}/${index}/_search`,
            qs: {q: req.query.q},
            json: true
        }, (error, response, body) => {
            if (error || !(response && response.statusCode === 200)) {
                res.status(500).json({
                    code: 'ES_ERROR',
                    message: 'Error in ElasticSearch service'
                });
            } else {
                results[index] = body.hits.hits.map(item => item._source);
                search();
            }
        });
    }
});

module.exports = router;
