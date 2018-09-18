const express = require('express');
const router = express.Router();
const http = require('https');
/* GET search results. */
router.get('/', function (req, res, next) {
    const keywords = req.query.q;
    let results = {'art': [], 'artizen': []};

    const options = {
        hostname: 'vpc-auramaze-test-lvic4eihmds7zwtnqganecktha.us-east-2.es.amazonaws.com',
        port: 443,
        method: 'GET',
        path: '/art/_search?q=' + keywords,
    };

    let back_req = http.request(options, function (response) {
        var responseBody = '';
        response.setEncoding('UTF-8');
        response.on('data', function (chunk) {
            responseBody += chunk;
        });

        response.on('end', function () {
            results['art'] = responseBody;
            res.send(JSON.stringify(results));
        });

    });


    back_req.on('error', function (err) {
        next(err);
    });

    back_req.end();
});

module.exports = router;
