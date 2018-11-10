require('dotenv').config();
// const providers = ['twitter', 'google', 'facebook', 'github']
const providers = ['google', 'facebook', 'github'];

const callbacks = providers.map(provider => `https://apidev.auramaze.org/v1/auth/${provider}/callback`);

const [googleURL, facebookURL] = callbacks;

exports.GOOGLE_CONFIG = {
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: googleURL
};

exports.FACEBOOK_CONFIG = {
    clientID: process.env.FACEBOOK_KEY,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
    callbackURL: facebookURL
};

const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};

exports.auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};
