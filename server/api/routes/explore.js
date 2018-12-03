require('dotenv').config();
const express = require('express');
const router = express.Router();
const {query, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;

/* GET nearby museums. */
router.get('/', [
    query('longitude').isDecimal(),
    query('latitude').isDecimal(),
    query('from').optional().isInt()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const from = parseInt(req.query.from) > 0 ? parseInt(req.query.from) : 0;
    const size = 10;

    rds.query('SELECT SQL_CALC_FOUND_ROWS *, ST_Distance_Sphere(POINT(?,?), location) AS distance FROM artizen WHERE location IS NOT NULL AND JSON_SEARCH(type, "one", "museum") IS NOT NULL ORDER BY distance LIMIT ? OFFSET ?; SELECT FOUND_ROWS() AS total;', [req.query.longitude, req.query.latitude, size, from], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            const total = result[1][0].total;
            result = result[0].map(item => item.location && item.location.x && item.location.y ? Object.assign(item, {
                location: {
                    longitude: item.location.x,
                    latitude: item.location.y
                }
            }) : item);
            res.json({
                data: result,
                next: from + size < total ? `${process.env.API_ENDPOINT}/explore/?longitude=${req.query.longitude}&latitude=${req.query.latitude}&from=${from + size}` : null
            });
        }
    });
});

module.exports = router;
