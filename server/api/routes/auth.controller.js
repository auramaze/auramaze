const common = require('./common');

exports.google = (req, res) => {
    const io = req.app.get('io');
    const user = common.toAuthJSON({id: req.user.auramaze_id, username: req.user.auramaze_username});
    user.name = req.user.displayName;
    user.photo = req.user.photos[0].value.replace(/sz=50/gi, 'sz=250');
    console.log(JSON.stringify(user));
    io.in(req.session.socketId).emit('google', user);
    res.end();
};

exports.facebook = (req, res) => {
    const io = req.app.get('io');
    const {givenName, familyName} = req.user.name;
    const user = common.toAuthJSON({id: req.user.auramaze_id, username: req.user.auramaze_username});
    user.name = `${givenName} ${familyName}`;
    user.photo = req.user.photos[0].value;
    console.log(JSON.stringify(user));
    io.in(req.session.socketId).emit('facebook', user);
    res.end();
};
