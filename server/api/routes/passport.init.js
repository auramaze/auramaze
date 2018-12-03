const passport = require('passport');
const validator = require('validator');
const common = require('./common');
const rds = common.rds;
const authCallback = require('./auth.callback');
const {OAuth2Strategy: GoogleStrategy} = require('passport-google-oauth');
const {Strategy: FacebookStrategy} = require('passport-facebook');
const LocalStrategy = require('passport-local');

const {
    GOOGLE_CONFIG, FACEBOOK_CONFIG
} = require('./auth.config');

module.exports = () => {
    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));

    // Adding each OAuth provider's strategy to passport
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, authCallback.google));
    passport.use(new FacebookStrategy(FACEBOOK_CONFIG, authCallback.facebook));

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, (id, password, done) => {
        id = id.toString();
        const column = validator.isEmail(id) ? 'email' : validator.isInt(id) ? 'id' : 'username';
        rds.query(`SELECT * FROM artizen WHERE ${column}=?`, [id], (err, result, fields) => {
            if (!err && result[0] && common.checkPassword(password, result[0].salt, result[0].hash)) {
                return done(null, result[0]);
            } else {
                return done(null, false);
            }
        });
    }));
};
