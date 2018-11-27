require('dotenv').config();
const express = require('express');
const router = express.Router();
const {query, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const {auth} = require('./auth.config');

/* GET timeline. */
router.get('/', [
    query('from').optional().isInt(),
], auth.required, function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    rds.query('SELECT text.*, author.username AS author_username, author.name AS author_name, author.avatar AS author_avatar, art.username AS art_username, art.title AS art_title, art.image AS art_image, artizen.username AS artizen_username, artizen.name AS artizen_name, artizen.avatar AS artizen_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT vote.status FROM vote WHERE vote.text_id=text.id AND vote.artizen_id=?) AS status FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN art ON text.art_id=art.id LEFT JOIN artizen AS artizen ON text.artizen_id=artizen.id INNER JOIN follow ON text.author_id=follow.followee_id LEFT JOIN vote ON text.id=vote.text_id WHERE follow.follower_id=? AND text.valid=1 GROUP BY text.id ORDER BY text.id DESC LIMIT 10', [id, id], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
