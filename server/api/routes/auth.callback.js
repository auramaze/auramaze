exports.google = (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(JSON.stringify(profile));
    profile.auramaze_id = 'auramaze';
    return cb(null, profile);
};

exports.facebook = (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(JSON.stringify(profile));
    profile.auramaze_id = 'auramaze';
    return cb(null, profile);
};
