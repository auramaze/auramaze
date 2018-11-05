const passport = require('passport');
const crypto = require('crypto');
const validator = require('validator');
const common = require('./common');
const rds = common.rds;
// const {Strategy: TwitterStrategy} = require('passport-twitter');
const {OAuth2Strategy: GoogleStrategy} = require('passport-google-oauth');
const {Strategy: FacebookStrategy} = require('passport-facebook');
const {Strategy: GithubStrategy} = require('passport-github');
const LocalStrategy = require('passport-local');
// const {
//     TWITTER_CONFIG, GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG
// } = require('../config');

const {
    GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG
} = require('./auth.config');

function validatePassword(password, salt, hash) {
    return hash === crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

module.exports = () => {

    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));

    // The callback that is invoked when an OAuth provider sends back user
    // information. Normally, you would save the user to the database
    // in this callback and it would be customized for each provider.
    const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile);

    // Adding each OAuth provider's strategy to passport
    // passport.use(new TwitterStrategy(TWITTER_CONFIG, callback))
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback));
    passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback));
    passport.use(new GithubStrategy(GITHUB_CONFIG, callback));

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, (id, password, done) => {
        id = id.toString();
        const column = validator.isEmail(id) ? 'email' : validator.isInt(id) ? 'id' : 'username';
        rds.query(`SELECT * FROM artizen WHERE ${column}=?`, [id], (err, result, fields) => {
            if (!err && result[0] && validatePassword(password, result[0].salt, result[0].hash)) {
                return done(null, result[0]);
            } else {
                return done(null, false);
            }
        });
    }));
};
