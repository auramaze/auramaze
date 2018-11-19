require('dotenv').config();
const mysql = require('mysql');
const rds = mysql.createConnection({
    host: process.env.AWS_RDS_HOST,
    user: process.env.AWS_RDS_USER,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DATABASE,
    typeCast: (field, next) => field.type === 'JSON' ? JSON.parse(field.string()) : next(),
    multipleStatements: true
});
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    params: {Bucket: process.env.AWS_S3_BUCKET}
});
const _ = require('lodash');
const franc = require('franc-min');
const convert3To1 = require('iso-639-3-to-1');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function Common() {
}

Common.prototype.rds = rds;
Common.prototype.s3 = s3;

// Check if username satisfies variants
Common.prototype.validateUsername = username => Boolean(username.match(/^(?!.*--)[a-z][a-z0-9-]{1,48}[a-z0-9]$/));

// Check if password satisfies variants
Common.prototype.validatePassword = password => Boolean(password.match(/^[A-Za-z0-9#?!@$%^&*-]{4,}$/));

// Get item data
Common.prototype.getItem = (group, id, authId, callback) => {
    let sql, parameters;
    if (isNaN(parseInt(id))) {
        sql = `SELECT * FROM ${group} WHERE username=?`;
        parameters = [id.toString()];
        if (group === 'artizen' && authId) {
            sql = 'SELECT artizen.*, EXISTS(SELECT * FROM follow INNER JOIN artizen ON followee_id=artizen.id WHERE follower_id=? AND artizen.username=?) AS following FROM artizen WHERE artizen.username=?';
            parameters = [authId, id.toString(), id.toString()];
        }
    } else {
        sql = `SELECT * FROM ${group} WHERE id=?`;
        parameters = [parseInt(id)];
        if (group === 'artizen' && authId) {
            sql = 'SELECT artizen.*, EXISTS(SELECT * FROM follow WHERE follower_id=? AND followee_id=?) AS following FROM artizen WHERE artizen.id=?';
            parameters = [authId, parseInt(id), parseInt(id)];
        }
    }

    rds.query(sql, parameters, callback);
};

// Insert user browsing history
Common.prototype.insertHistory = (userId, group, id) => {
    rds.query(`INSERT INTO history (user_id, ${group}_id) VALUES (?)`, [[userId, id]]);
};

// Batch get item data
Common.prototype.batchGetItems = (group, id, callback) => {
    rds.query(`SELECT * FROM ${group} WHERE id IN (?)`, [id], callback);
};

// Get all introductions/reviews of item
Common.prototype.getTexts = (group, itemId, textType, authId, callback) => {
    let sql, parameters;

    if (isNaN(parseInt(itemId))) {
        if (authId) {
            sql = `SELECT text.*, author.username as author_username, author.name as author_name, author.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT status FROM vote WHERE text_id=text.id AND artizen_id=?) AS status FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN vote ON text.id=vote.text_id INNER JOIN ${group} AS ${group} ON text.${group}_id=${group}.id WHERE ${group}.username=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [authId, itemId, textType];
        } else {
            sql = `SELECT text.*, author.username as author_username, author.name as author_name, author.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN vote ON text.id=vote.text_id INNER JOIN ${group} AS ${group} ON text.${group}_id=${group}.id WHERE ${group}.username=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [itemId, textType];
        }
    } else {
        if (authId) {
            sql = `SELECT text.*, artizen.username as author_username, artizen.name as author_name, artizen.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT status FROM vote WHERE text_id=text.id AND artizen_id=?) AS status FROM text INNER JOIN artizen ON text.author_id=artizen.id LEFT JOIN vote ON text.id=vote.text_id WHERE text.${group}_id=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [authId, itemId, textType];
        } else {
            sql = `SELECT text.*, artizen.username as author_username, artizen.name as author_name, artizen.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text INNER JOIN artizen ON text.author_id=artizen.id LEFT JOIN vote ON text.id=vote.text_id WHERE text.${group}_id=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [itemId, textType];
        }
    }

    rds.query(sql, parameters, callback);
};

// Get one introduction/review of item
Common.prototype.getText = (group, itemId, textType, textId, authId, callback) => {
    let sql, parameters;

    if (isNaN(parseInt(itemId))) {
        if (authId) {
            sql = `SELECT text.*, author.username as author_username, author.name as author_name, author.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT status FROM vote WHERE text_id=text.id AND artizen_id=?) AS status FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN vote ON text.id=vote.text_id INNER JOIN ${group} AS ${group} ON text.${group}_id=${group}.id WHERE text.id=? AND ${group}.username=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [authId, textId, itemId, textType];
        } else {
            sql = `SELECT text.*, author.username as author_username, author.name as author_name, author.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text INNER JOIN artizen AS author ON text.author_id=author.id LEFT JOIN vote ON text.id=vote.text_id INNER JOIN ${group} AS ${group} ON text.${group}_id=${group}.id WHERE text.id=? AND ${group}.username=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [textId, itemId, textType];
        }
    } else {
        if (authId) {
            sql = `SELECT text.*, artizen.username as author_username, artizen.name as author_name, artizen.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down, (SELECT status FROM vote WHERE text_id=text.id AND artizen_id=?) AS status FROM text INNER JOIN artizen ON text.author_id=artizen.id LEFT JOIN vote ON text.id=vote.text_id WHERE text.id=? AND text.${group}_id=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [authId, textId, itemId, textType];
        } else {
            sql = `SELECT text.*, artizen.username as author_username, artizen.name as author_name, artizen.avatar as author_avatar, SUM(CASE WHEN status=1 THEN 1 ELSE 0 END) AS up, SUM(CASE WHEN status=-1 THEN 1 ELSE 0 END) AS down FROM text INNER JOIN artizen ON text.author_id=artizen.id LEFT JOIN vote ON text.id=vote.text_id WHERE text.id=? AND text.${group}_id=? AND text.type=? AND text.valid GROUP BY text.id`;
            parameters = [textId, itemId, textType];
        }
    }

    rds.query(sql, parameters, callback);
};

// Vote for one introduction/review of item
Common.prototype.voteText = (textId, authId, type, callback) => {
    rds.query('REPLACE INTO vote (text_id, artizen_id, status) VALUES (?);', [[textId, authId, type === 'up' ? 1 : -1]], callback);
};

// Insert item data
Common.prototype.putItem = (group, item, callback) => {
    let sql, parameters;
    if (group === 'art') {
        sql = 'INSERT INTO art (username, title, image, completion_year, metadata) VALUES (?)';
        parameters = [[parseInt(item.username) === 0 ? null : item.username, item.title ? JSON.stringify(item.title) : null, item.image ? JSON.stringify(item.image) : null, item.completion_year, JSON.stringify(_.omit(item, ['id', 'username', 'title', 'image', 'completion_year']))]];
    } else {
        sql = 'INSERT INTO artizen (username, name, type, avatar, metadata, email, salt, hash) VALUES (?)';
        parameters = [[parseInt(item.username) === 0 ? null : item.username, item.name ? JSON.stringify(item.name) : null, item.type ? JSON.stringify(item.type) : null, item.avatar, JSON.stringify(_.omit(item, ['id', 'username', 'name', 'type', 'avatar', 'email', 'salt', 'hash', 'password'])), item.email, item.salt, item.hash]];
    }

    rds.query(sql, parameters, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            callback(err, result, fields);
        } else {
            rds.query(`SELECT id, username from ${group} where id=LAST_INSERT_ID()`, callback);
        }
    });
};

// Update item data
Common.prototype.updateItem = (group, id, item, callback) => {
    let sql, parameters;
    let condition;

    if (isNaN(parseInt(id))) {
        condition = 'WHERE username=?';
        id = id.toString();
    } else {
        condition = 'WHERE id=?';
        id = parseInt(id);
    }

    if (group === 'art') {
        const allowed = ['username', 'title', 'image', 'completion_year', 'metadata'];
        const conversion = {
            username: username => username,
            title: title => JSON.stringify(title),
            image: image => JSON.stringify(image),
            completion_year: completion_year => completion_year,
            metadata: metadata => JSON.stringify(metadata)
        };

        const keys = Object.keys(item);

        const columns = keys.filter(key => allowed.includes(key));

        if (columns.length === 0) {
            callback(null, null);
            return;
        }

        sql = `UPDATE art SET ${columns.map(column => `${column}=?`).join(', ')} ${condition}`;
        parameters = columns.map(column => conversion[column](item[column]));
    } else {
        if (item.password) {
            const {salt, hash} = generateSaltHash(item.password);
            item.salt = salt;
            item.hash = hash;
        }
        const allowed = ['username', 'name', 'type', 'avatar', 'metadata', 'email', 'salt', 'hash'];
        const conversion = {
            username: username => username,
            name: name => JSON.stringify(name),
            type: type => JSON.stringify(type),
            avatar: avatar => avatar,
            metadata: metadata => JSON.stringify(metadata),
            email: email => email,
            salt: salt => salt,
            hash: hash => hash
        };

        const keys = Object.keys(item);

        const columns = keys.filter(key => allowed.includes(key));

        if (columns.length === 0) {
            callback(null, null);
            return;
        }

        sql = `UPDATE artizen SET ${columns.map(column => `${column}=?`).join(', ')} ${condition}`;
        parameters = columns.map(column => conversion[column](item[column]));
    }
    parameters.push(id);
    rds.query(sql, parameters, callback);
};

// Delete item data and relations
Common.prototype.deleteItem = (group, id, callback) => {
    let sql, parameters;
    if (isNaN(parseInt(id))) {
        sql = `DELETE FROM ${group} WHERE username=?`;
        parameters = [id.toString()];
    } else {
        sql = `DELETE FROM ${group} WHERE id=?`;
        parameters = [parseInt(id)];
    }
    rds.query(sql, parameters, callback);
};

Common.prototype.convertContentToPlainText = (content) => {
    return content.blocks
        .map(block => {
            return block.text || '';
        })
        .join('\n');
};

// Detect language of text and return ISO 639-1 code, undefined if not detected
Common.prototype.detectLanguage = (content) => {
    if (content.blocks) {
        content = Common.prototype.convertContentToPlainText(content);
    }
    return convert3To1(franc(content, {minLength: 1}));
};


const generateJWT = (user) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        id: parseInt(user.id),
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.SECRET);
};

Common.prototype.generateJWT = generateJWT;

Common.prototype.toAuthJSON = (user) => {
    return {
        id: user.id,
        username: user.username,
        token: generateJWT(user),
    };
};

const generateSaltHash = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {salt, hash};
};

Common.prototype.generateSaltHash = generateSaltHash;


module.exports = new Common();