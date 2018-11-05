require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {body, oneOf, validationResult} = require('express-validator/check');
const authController = require('./auth.controller');
const {auth} = require('./auth.config');
const common = require('./common');
const rds = common.rds;
// Setting up the passport middleware for each of the OAuth providers
// const twitterAuth = passport.authenticate('twitter');
const googleAuth = passport.authenticate('google', {scope: ['profile']});
const facebookAuth = passport.authenticate('facebook');
const githubAuth = passport.authenticate('github');

// Routes that are triggered by the callbacks from each OAuth provider once 
// the user has authenticated successfully
// router.get('/twitter/callback', twitterAuth, authController.twitter);
router.get('/google/callback', googleAuth, authController.google);
router.get('/facebook/callback', facebookAuth, authController.facebook);
router.get('/github/callback', githubAuth, authController.github);

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right 
// socket
router.use((req, res, next) => {
    req.session.socketId = req.query.socketId;
    next();
});

// Routes that are triggered on the client
// router.get('/twitter', twitterAuth);
router.get('/google', googleAuth);
router.get('/facebook', facebookAuth);
router.get('/github', githubAuth);

function generateJWT(user) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        id: parseInt(user.id),
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.SECRET);
}

function toAuthJSON(user) {
    return {
        id: user.id,
        token: generateJWT(user),
    };
}

function generateSaltHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {salt, hash};
}

// Sign up with email
router.post('/signup', [
    body('email').isEmail(),
    body('password').custom(common.validatePassword).withMessage('Invalid password')
], auth.optional, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {salt, hash} = generateSaltHash(req.body.password);
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
            res.json(toAuthJSON({id: result[0].id}));
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
    return passport.authenticate('local', {session: false}, (err, artizen) => {
        /* istanbul ignore if */
        if (err) {
            return next(err);
        } else {
            if (artizen) {
                return res.json(toAuthJSON(artizen));
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