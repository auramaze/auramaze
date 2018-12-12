require('dotenv').config();
const express = require('express');
const router = express.Router();
const {body, oneOf, validationResult} = require('express-validator/check');
const common = require('./common');
const rds = common.rds;
const request = require('request');
const {auth} = require('./auth.config');

router.post('/google', [
    body('access_token').exists(),
], auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const {access_token} = req.body;
    request.get({
        url: 'https://www.googleapis.com/userinfo/v2/me',
        headers: {Authorization: `Bearer ${access_token}`},
        json: true
    }, (error, response, body) => {
        if (response && response.statusCode === 200) {
            rds.query('UPDATE artizen SET google=? WHERE id=?',
                [body.id, id],
                (err, result, fields) => {
                    if (err) {
                        /* istanbul ignore else */
                        if (err.code === 'ER_DUP_ENTRY') {
                            res.status(400).json({
                                code: 'GOOGLE_EXIST',
                                message: 'Google already bound to another account'
                            });
                        } else {
                            next(err);
                        }
                    } else {
                        res.json({
                            message: `Bind Google success: ${id}`,
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
});

router.post('/facebook', oneOf([
    body('access_token').exists(),
]), auth.required, (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {payload: {id}} = req;

    const {access_token} = req.body;
    request.get({
        url: `https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,picture.width(250)`,
        json: true
    }, (error, response, body) => {
        if (response && response.statusCode === 200) {
            rds.query('UPDATE artizen SET facebook=? WHERE id=?',
                [body.id, id],
                (err, result, fields) => {
                    if (err) {
                        /* istanbul ignore else */
                        if (err.code === 'ER_DUP_ENTRY') {
                            res.status(400).json({
                                code: 'FACEBOOK_EXIST',
                                message: 'Facebook already bound to another account'
                            });
                        } else {
                            next(err);
                        }
                    } else {
                        res.json({
                            message: `Bind Facebook success: ${id}`,
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
});

module.exports = router;