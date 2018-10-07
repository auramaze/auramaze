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
            url: `https://vpc-auramaze-test-lvic4eihmds7zwtnqganecktha.us-east-2.es.amazonaws.com/${index}/_search`,
            qs: {q: req.query.q},
            json: true
        }, (error, response, body) => {
            if (error) {
                next(error);
            } else {
                if (response && response.statusCode === 200) {
                    results[index] = body.hits.hits.map(item => item._source);
                    search();
                } else {
                    res.status(response.statusCode);
                }
            }
        });
    }
});

module.exports = router;
