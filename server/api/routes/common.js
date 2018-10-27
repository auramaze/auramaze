require('dotenv').config();
const mysql = require('mysql');
const rds = mysql.createConnection({
    host: process.env.AWS_RDS_HOST,
    user: process.env.AWS_RDS_USER,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DATABASE,
    typeCast: (field, next) => field.type === 'JSON' ? JSON.parse(field.string()) : next()
});
const _ = require('lodash');
const franc = require('franc-min');
const convert3To1 = require('iso-639-3-to-1');

function Common() {
}

Common.prototype.rds = rds;

// Check if username satisfies variants
Common.prototype.validateUsername = username => Boolean(username.match(/^(?!.*--)[a-z][a-z0-9-]{1,48}[a-z0-9]$/));

// Get item data
Common.prototype.getItem = (group, id, callback) => {
    let sql, parameters;
    if (isNaN(parseInt(id))) {
        sql = `SELECT * FROM ${group} WHERE username=?`;
        parameters = [id.toString()];
    } else {
        sql = `SELECT * FROM ${group} WHERE id=?`;
        parameters = [parseInt(id)];
    }
    rds.query(sql, parameters, callback);
};

// Batch get item data
Common.prototype.batchGetItems = (group, id, callback) => {
    rds.query(`SELECT * FROM ${group} WHERE id IN (?)`, [id], callback);
};

// Insert item data
Common.prototype.putItem = (group, item, callback) => {
    let sql, parameters;
    if (group === 'art') {
        sql = 'INSERT INTO art (username, title, image, completion_year, attributes) VALUES (?)';
        parameters = [[parseInt(item.username) === 0 ? null : item.username, item.title ? JSON.stringify(item.title) : null, item.image ? JSON.stringify(item.image) : null, item.completion_year, JSON.stringify(_.omit(item, ['id', 'username', 'title', 'image', 'completion_year']))]];
    } else {
        sql = 'INSERT INTO artizen (username, name, type, avatar, attributes) VALUES (?)';
        parameters = [[parseInt(item.username) === 0 ? null : item.username, item.name ? JSON.stringify(item.name) : null, item.type ? JSON.stringify(item.type) : null, item.avatar, JSON.stringify(_.omit(item, ['id', 'username', 'name', 'type', 'avatar']))]];
    }

    rds.query(sql, parameters, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            callback(err, result, fields);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', callback);
        }
    });
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


module.exports = new Common();