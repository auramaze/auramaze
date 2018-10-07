const express = require('express');
const router = express.Router();
const request = require('request');
/* GET search results. */
router.get('/', function (req, res, next) {
    const keywords = req.query.q;
    let results = {'art': [], 'artizen': []};


    request.get({
        url: 'https://vpc-auramaze-test-lvic4eihmds7zwtnqganecktha.us-east-2.es.amazonaws.com/art/_search',
        qs: {q: req.query.q},
        json: true
    }, (error, response, body) => {
        if (error){
            next(error);
        } else {
            if (response && response.statusCode === 200) {
                res.json(body);
            } else {
                res.status(response.statusCode);
            }
        }
    });
});

module.exports = router;
