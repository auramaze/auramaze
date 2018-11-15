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

    rds.query('SELECT text.*, art.id AS art_id, art.username AS art_username, art.title AS art_title, art.image AS art_image, artizen.id AS artizen_id, artizen.username AS artizen_username, artizen.name AS artizen_name, artizen.avatar AS artizen_avatar FROM text LEFT JOIN art ON text.art_id=art.id LEFT JOIN artizen ON text.artizen_id=artizen.id INNER JOIN follow ON text.author_id=follow.followee_id WHERE follow.follower_id=? ORDER BY text.id DESC LIMIT 10', [id], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
