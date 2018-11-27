const common = require('./common');
const rds = common.rds;

// exports.google = (req, res) => {
//     const io = req.app.get('io');
//     const user = common.toAuthJSON({id: req.user.auramaze_id, username: req.user.auramaze_username});
//     user.name = req.user.displayName;
//     user.photo = req.user.photos[0].value.replace(/sz=50/gi, 'sz=250');
//     io.in(req.session.socketId).emit('google', user);
//     res.end();
// };

exports.facebook = (req, res, next) => {
    const {id, name, picture} = req.body;
    const avatar = picture && picture.data && picture.data.url;
    rds.query('INSERT INTO artizen (facebook, name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [[id, name, avatar]],
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
