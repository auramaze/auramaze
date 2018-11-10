const common = require('./common');
const rds = common.rds;

exports.google = (accessToken, refreshToken, profile, cb) => {
    rds.query('INSERT INTO artizen (google, name) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[profile.id, JSON.stringify({default: profile.displayName})]],
        (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                return cb(null, false);
            } else {
                rds.query('SELECT LAST_INSERT_ID() AS id', (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        return cb(null, false);
                    } else {
                        profile.auramaze_id = result[0].id;
                        return cb(null, profile);
                    }
                });
            }
        });
};

exports.facebook = (accessToken, refreshToken, profile, cb) => {
    const {givenName, familyName} = profile.name;
    rds.query('INSERT INTO artizen (facebook, name) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[profile.id, JSON.stringify({default: `${givenName} ${familyName}`})]],
        (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                return cb(null, false);
            } else {
                rds.query('SELECT LAST_INSERT_ID() AS id', (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        return cb(null, false);
                    } else {
                        profile.auramaze_id = result[0].id;
                        return cb(null, profile);
                    }
                });
            }
        });
};
