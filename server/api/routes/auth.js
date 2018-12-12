require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {body, oneOf, validationResult} = require('express-validator/check');
const authController = require('./auth.controller');
const common = require('./common');
const rds = common.rds;
const _ = require('lodash');

router.post('/google', [body('id').isInt()], authController.google);
router.post('/facebook', [body('id').isInt()], authController.facebook);

// Sign up with email
router.post('/signup', [
    body('email').isEmail(),
    body('password').custom(common.validatePassword).withMessage('Invalid password')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const body = _.pick(req.body, ['name', 'username', 'email', 'password', 'avatar']);

    const {salt, hash} = common.generateSaltHash(body.password);
    body.salt = salt;
    body.hash = hash;

    common.putItem('artizen', body, (err, result, fields) => {
        if (err) {
            /* istanbul ignore else */
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({
                    code: 'EMAIL_EXIST',
                    message: `Email already exists: ${body.email}`
                });
            } else {
                next(err);
            }
        } else {
            rds.query('INSERT INTO follow (user_id, artizen_id) VALUES (?, (SELECT id FROM artizen WHERE username="wikipedia"))', [result[0].id]);
            res.json(common.toAuthJSON(result[0]));
        }
    });
});

// Login with id, username or email
router.post('/login', [
    oneOf([
        body('id').isEmail(),
        body('id').isInt().isLength({min: 9, max: 9}),
        body('id').custom(common.validateUsername).withMessage('Invalid username')
    ]),
    body('password').custom(common.validatePassword).withMessage('Invalid password')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    return passport.authenticate('local', {session: false}, (err, artizen) => {
        /* istanbul ignore if */
        if (err) {
            return next(err);
        } else {
            if (artizen) {
                return res.json(common.toAuthJSON(artizen));
            } else {
                res.status(400).json({
                    code: 'LOGIN_ERROR',
                    message: 'ID or password invalid'
                });
            }
        }
    })(req, res, next);
});

module.exports = router;