const common = require('./common');
const rds = common.rds;
const request = require('request');

exports.google = (req, res, next) => {
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
};


exports.facebook = (req, res, next) => {
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
};
