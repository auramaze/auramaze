require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {body, oneOf, validationResult} = require('express-validator/check');
const authController = require('./auth.controller');
const authMobile = require('./auth.mobile');
const {auth} = require('./auth.config');
const common = require('./common');
const rds = common.rds;
// Setting up the passport middleware for each of the OAuth providers
const googleAuth = passport.authenticate('google', {scope: ['profile']});
const facebookAuth = passport.authenticate('facebook');

// Routes that are triggered by the callbacks from each OAuth provider once 
// the user has authenticated successfully
router.get('/google/callback', googleAuth, authController.google);
router.get('/facebook/callback', facebookAuth, authController.facebook);

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right 
// socket
router.use((req, res, next) => {
    req.session.socketId = req.query.socketId;
    next();
});

// Routes that are triggered on the web client
router.get('/google', googleAuth);
router.get('/facebook', facebookAuth);

// Routes that are triggered on the mobile client
// router.post('/google/mobile', authMobile.google);
router.post('/facebook/mobile', [body('id').isInt()], authMobile.facebook);

// Sign up with email
router.post('/signup', [
    body('email').isEmail(),
    body('password').custom(common.validatePassword).withMessage('Invalid password')
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {salt, hash} = common.generateSaltHash(req.body.password);
    req.body.salt = salt;
    req.body.hash = hash;

    common.putItem('artizen', req.body, (err, result, fields) => {
        if (err) {
            /* istanbul ignore else */
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({
                    code: 'EMAIL_EXIST',
                    message: `Email already exists: ${req.body.email}`
                });
            } else {
                next(err);
            }
        } else {
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
], auth.optional, (req, res, next) => {
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

// Test route only authenticated users have access
router.get('/current', auth.required, (req, res, next) => {
    const {payload: {id}} = req;

    rds.query('SELECT * FROM artizen WHERE id=?', [id], (err, result, fields) => {
        /* istanbul ignore else */
        if (!err && result[0]) {
            return res.json(result[0]);
        } else {
            return res.status(400);
        }
    });
});

module.exports = router;