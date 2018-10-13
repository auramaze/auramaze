require('dotenv').config();
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const mysql = require('mysql');
const rds = mysql.createConnection({
    'host': process.env.AWS_RDS_HOST,
    'user': process.env.AWS_RDS_USER,
    'password': process.env.AWS_RDS_PASSWORD,
    'database': process.env.AWS_RDS_DATABASE
});
const franc = require('franc-min');
const convert3To1 = require('iso-639-3-to-1');

function Common() {
}

Common.prototype.dynamodb = dynamodb;
Common.prototype.rds = rds;

// Check if username satisfies variants
Common.prototype.validateUsername = username => Boolean(username.match(/^(?!.*--)[a-z][a-z0-9-]{1,48}[a-z0-9]$/));

// Insert username into Aurora table `art` or `artizen`
Common.prototype.insertItem = (group, username, callback) => {
    let sql, parameters;
    if (parseInt(username) === 0) {
        sql = `INSERT INTO ${group} VALUES ()`;
        parameters = null;
    } else {
        sql = `INSERT INTO ${group} (username) VALUES (?)`;
        parameters = [username];
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

// Check item existence in Aurora and return id if item exists
Common.prototype.checkExist = (group, id, callback) => {
    let sql, parameters;
    if (isNaN(parseInt(id))) {
        sql = `SELECT * FROM ${group} WHERE username=?`;
        parameters = [id.toString()];
    } else {
        sql = `SELECT * FROM ${group} WHERE id=?`;
        parameters = [parseInt(id)];
    }
    rds.query(sql, parameters, (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            callback(err, null);
        } else {
            if (result.length) {
                callback(null, parseInt(result[0].id));
            } else {
                callback(null, null);
            }
        }
    });
};

// Get item data from DynamoDB
Common.prototype.getItem = (group, id, callback) => {
    const params = {
        Key: {id: parseInt(id)},
        TableName: group
    };
    dynamodb.get(params, callback);
};

// Put item data into DynamoDB
Common.prototype.putItem = (group, item, callback) => {
    const params = {
        Item: item,
        TableName: group
    };
    dynamodb.put(params, callback);
};

// Delete item data from DynamoDB
Common.prototype.deleteItem = (group, id, callback) => {
    const params = {
        Key: {id: parseInt(id)},
        TableName: group
    };
    dynamodb.delete(params, callback);
};


// Add type to artizen data in DynamoDB table `artizen`
Common.prototype.addType = (id, type, callback) => {
    var params = {
        TableName: 'artizen',
        Key: {id: parseInt(id)},
        UpdateExpression: 'ADD #k :v',
        ExpressionAttributeNames: {'#k': 'type'},
        ExpressionAttributeValues: {
            ':v': dynamodb.createSet([type])
        }
    };

    dynamodb.update(params, callback);
};

// Detect language of text and return ISO 639-1 code, undefined if not detected
Common.prototype.detectLanguage = (text) => {
    return convert3To1(franc(text, {minLength: 1}));
};


module.exports = new Common();