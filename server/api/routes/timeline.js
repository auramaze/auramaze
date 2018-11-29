require('dotenv').config();
const express = require('express');
const router = express.Router();
const {query, validationResult, oneOf} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const {auth} = require('./auth.config');

/* GET timeline. */
router.get('/', [
    query('min').optional().isInt(),
    query('max').optional().isInt(),
    oneOf([
        query('min').not().exists(),
        query('max').not().exists(),
    ])
], auth.required, function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    if (parseInt(req.query.min) >= 0) {
        const min = parseInt(req.query.min);

        rds.query('SELECT SQL_CALC_FOUND_ROWS text.*, author.username AS author_username, author.name AS author_name, author.avatar AS author_avatar, art.username AS art_username, art.title AS art_title, art.image AS art_image, artizen.username AS artizen_username, artizen.name AS artizen_name, artizen.avatar AS artizen_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT vote.status FROM vote WHERE vote.text_id=text.id AND vote.artizen_id=?) AS status FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN art ON text.art_id=art.id LEFT JOIN artizen AS artizen ON text.artizen_id=artizen.id INNER JOIN follow ON text.author_id=follow.user_id LEFT JOIN vote ON text.id=vote.text_id WHERE follow.user_id=? AND text.valid=1 AND text.id>=? GROUP BY text.id ORDER BY text.id DESC LIMIT 10; SELECT FOUND_ROWS() AS total;', [id, id, min], (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                next(err);
            } else {
                const response = {data: result[0], next: null};

                if (result[0].length && result[0][result[0].length - 1].id > min) {
                    const nextMax = result[0][result[0].length - 1].id - 1;
                    response.next = `${process.env.API_ENDPOINT}/timeline?max=${nextMax}`;
                }
                res.json(response);
            }
        });
    } else {
        const max = parseInt(req.query.max) >= 0 ? parseInt(req.query.max) : Number.MAX_SAFE_INTEGER;

        rds.query('SELECT SQL_CALC_FOUND_ROWS text.*, author.username AS author_username, author.name AS author_name, author.avatar AS author_avatar, art.username AS art_username, art.title AS art_title, art.image AS art_image, artizen.username AS artizen_username, artizen.name AS artizen_name, artizen.avatar AS artizen_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT vote.status FROM vote WHERE vote.text_id=text.id AND vote.artizen_id=?) AS status FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN art ON text.art_id=art.id LEFT JOIN artizen AS artizen ON text.artizen_id=artizen.id INNER JOIN follow ON text.author_id=follow.artizen_id LEFT JOIN vote ON text.id=vote.text_id WHERE follow.user_id=? AND text.valid=1 AND text.id<=? GROUP BY text.id ORDER BY text.id DESC LIMIT 10; SELECT FOUND_ROWS() AS total;', [id, id, max], (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                next(err);
            } else {
                const response = {data: result[0], next: null};

                if (result[0].length < result[1][0].total && result[0].length) {
                    const nextMax = result[0][result[0].length - 1].id - 1;
                    response.next = `${process.env.API_ENDPOINT}/timeline?max=${nextMax}`;
                }
                res.json(response);
            }
        });
    }
});

module.exports = router;
