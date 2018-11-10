exports.google = (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(JSON.stringify(profile));
    profile.auramaze_id = 'auramaze';
    return cb(null, profile);
};

exports.facebook = (req, res) => {
    const io = req.app.get('io');
    const {givenName, familyName} = req.user.name;
    console.log(JSON.stringify(req.user));
    const user = {
        name: `${givenName} ${familyName}`,
        photo: req.user.photos[0].value
    };
    io.in(req.session.socketId).emit('facebook', user);
    res.end();
};
