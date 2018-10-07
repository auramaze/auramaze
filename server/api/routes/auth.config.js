// const providers = ['twitter', 'google', 'facebook', 'github']
const providers = ['google', 'facebook', 'github'];

const callbacks = providers.map(provider => `https://apidev.auramaze.org/v1/auth/${provider}/callback`);

// const [twitterURL, googleURL, facebookURL, githubURL] = callbacks
const [googleURL, facebookURL, githubURL] = callbacks;

// exports.TWITTER_CONFIG = {
//   consumerKey: process.env.TWITTER_KEY,
//   consumerSecret: process.env.TWITTER_SECRET,
//   callbackURL: twitterURL,
// }

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

exports.GITHUB_CONFIG = {
    clientID: process.env.GITHUB_KEY,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: githubURL
};