const common = require('./common');
const rds = common.rds;

exports.google = (accessToken, refreshToken, profile, cb) => {
    rds.query('INSERT INTO artizen (google, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[profile.id, JSON.stringify({default: profile.displayName}), profile.photos[0].value.replace(/sz=50/gi, 'sz=250')]],
        (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                return cb(null, false);
            } else {
                rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        return cb(null, false);
                    } else {
                        profile.auramaze_id = result[0].id;
                        profile.auramaze_username = result[0].username;
                        return cb(null, profile);
                    }
                });
            }
        });
};

exports.facebook = (accessToken, refreshToken, profile, cb) => {
    const {givenName, familyName} = profile.name;
    rds.query('INSERT INTO artizen (facebook, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[profile.id, JSON.stringify({default: `${givenName} ${familyName}`}), profile.photos[0].value]],
        (err, result, fields) => {
            /* istanbul ignore if */
            if (err) {
                return cb(null, false);
            } else {
                rds.query('SELECT id, username from artizen where id=LAST_INSERT_ID()', (err, result, fields) => {
                    /* istanbul ignore if */
                    if (err) {
                        return cb(null, false);
                    } else {
                        profile.auramaze_id = result[0].id;
                        profile.auramaze_username = result[0].username;
                        return cb(null, profile);
                    }
                });
            }
        });
};
