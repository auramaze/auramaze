require('dotenv').config();
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
    admin: (req, res, next) => {
        const {payload: {id}} = req;
        if (id !== parseInt(process.env.ADMIN_ID)) {
            res.status(403).json({
                code: 'FORBIDDEN',
                message: 'Unauthorized for admin API.'
            }).end();
        } else {
            next();
        }
    }
};
