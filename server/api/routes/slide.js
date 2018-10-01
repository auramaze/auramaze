var express = require('express');
var router = express.Router();
const common = require('./common');
const rds = common.rds;

/* GET slide urls. */
router.get('/', (req, res, next) => {
    rds.query('SELECT * FROM slide WHERE id<5 ORDER BY RAND()', (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result.map(item => item.url));
        }
    });
});

module.exports = router;
