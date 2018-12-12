require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {body, oneOf, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const _ = require('lodash');
const request = require('request');

router.post('/google', oneOf([
    body('access_token').exists(),
    body('id').isInt()
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let {id, name, avatar, access_token} = req.body;
    if (access_token) {
        request.post({
            url: 'https://www.googleapis.com/userinfo/v2/me',
            headers: {Authorization: `Bearer ${access_token}`},
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                id = body.id;
                name = body.name;
                avatar = body.picture;
                rds.query('INSERT INTO artizen (google, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
                    [[id, JSON.stringify({default: name}), avatar]],
                    (err, result, fields) => {
                        /* istanbul ignore if */
                        if (err) {
                            next(err);
                        } else {
                            rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                                /* istanbul ignore if */
                                if (err) {
                                    next(err);
                                } else {
                                    const {id, username} = result[0];
                                    const user = common.toAuthJSON({id, username});
                                    res.json(user);
                                }
                            });
                        }
                    });
            } else {
                res.status(400).json({
                    code: 'GOOGLE_ACCESS_TOKEN_INVALID',
                    message: `Google access token invalid: ${req.body.access_token}`
                });
            }
        });
    } else {
        rds.query('INSERT INTO artizen (google, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
            [[id, JSON.stringify({default: name}), avatar]],
            (err, result, fields) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                        /* istanbul ignore if */
                        if (err) {
                            next(err);
                        } else {
                            const {id, username} = result[0];
                            const user = common.toAuthJSON({id, username});
                            res.json(user);
                        }
                    });
                }
            });
    }
});

router.post('/facebook', oneOf([
    body('access_token').exists(),
    body('id').isInt()
]), (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let {id, name, avatar, access_token} = req.body;
    if (access_token) {
        request.get({
            url: `https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,picture.width(250)`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                id = body.id;
                name = body.name;
                avatar = body.picture && body.picture.data && body.picture.data.url;
                rds.query('INSERT INTO artizen (facebook, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
                    [[id, JSON.stringify({default: name}), avatar]],
                    (err, result, fields) => {
                        /* istanbul ignore if */
                        if (err) {
                            next(err);
                        } else {
                            rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                                /* istanbul ignore if */
                                if (err) {
                                    next(err);
                                } else {
                                    const {id, username} = result[0];
                                    const user = common.toAuthJSON({id, username});
                                    res.json(user);
                                }
                            });
                        }
                    });
            } else {
                res.status(400).json({
                    code: 'FACEBOOK_ACCESS_TOKEN_INVALID',
                    message: `Facebook access token invalid: ${req.body.access_token}`
                });
            }
        });
    } else {
        rds.query('INSERT INTO artizen (facebook, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
            [[id, JSON.stringify({default: name}), avatar]],
            (err, result, fields) => {
                /* istanbul ignore if */
                if (err) {
                    next(err);
                } else {
                    rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                        /* istanbul ignore if */
                        if (err) {
                            next(err);
                        } else {
                            const {id, username} = result[0];
                            const user = common.toAuthJSON({id, username});
                            res.json(user);
                        }
                    });
                }
            });
    }
});

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