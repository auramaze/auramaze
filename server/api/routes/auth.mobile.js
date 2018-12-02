const common = require('./common');
const rds = common.rds;

exports.google = (req, res, next) => {
    const {id, name, picture} = req.body;
    rds.query('INSERT INTO artizen (google, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[id, JSON.stringify({default: name}), picture]],
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
};


exports.facebook = (req, res, next) => {
    const {id, name, picture} = req.body;
    const avatar = picture && picture.data && picture.data.url;
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
};
