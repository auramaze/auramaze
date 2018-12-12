const passport = require('passport');
const validator = require('validator');
const common = require('./common');
const rds = common.rds;
const LocalStrategy = require('passport-local');

module.exports = () => {
    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));

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
