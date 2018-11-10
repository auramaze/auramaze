exports.google = (req, res) => {
    const io = req.app.get('io');
    console.log(JSON.stringify(req.user));
    const user = {
        name: req.user.displayName,
        photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250')
    };
    io.in(req.session.socketId).emit('google', user);
    res.end();
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
