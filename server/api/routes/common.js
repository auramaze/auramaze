const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: 'us-east-2'});
const fs = require('fs');
const path = require('path');
const os = require('os');
const mysql = require('mysql');
const rds = mysql.createConnection(JSON.parse(fs.readFileSync(path.join(os.homedir(), '.aws/rds'), 'utf8')));

function Common() {
}

Common.prototype.dynamodb = dynamodb;
Common.prototype.rds = rds;

// Check if username satisfies variants
Common.prototype.validateUsername = function (username) {
    return Boolean(username.match(/^(?!.*--)[a-z][a-z0-9\-]{1,48}[a-z0-9]$/));
};

// Check if item satisfies variants in PUT method
Common.prototype.validateItem = function (item) {
    return Boolean(item && item.username && item.name && item.name.default);
};

// Delete username from Aurora table `username`
Common.prototype.deleteUsername = function (username, callback) {
    rds.query('DELETE FROM username WHERE username=?', [username], callback);
};

// Insert username into Aurora table `username`
Common.prototype.insertUsername = function (username, callback) {
    rds.query('INSERT INTO username (username) VALUES (?)', [username], callback);
};

// Increment id in Aurora table `art_id` or `artizen_id` and return new id
Common.prototype.incrementId = function (group, callback) {
    const tableName = group + '_id';
    rds.query(`UPDATE ${tableName} SET id=LAST_INSERT_ID(id+1)`, function (err, result, fields) {
        if (err) {
            callback(err, result, fields);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', callback);
        }
    });
};

// Get item data from DynamoDB
Common.prototype.getItem = function (group, id, callback) {
    let params = {TableName: group};
    if (isNaN(parseInt(id))) {
        Object.assign(params, {
            IndexName: 'username_index',
            KeyConditionExpression: 'username = :v1',
            ExpressionAttributeValues: {':v1': id.toString()}
        });
    } else {
        Object.assign(params, {
            KeyConditionExpression: 'id = :v1',
            ExpressionAttributeValues: {':v1': parseInt(id)}
        });
    }

    dynamodb.query(params, callback);
};

// Put item data into DynamoDB
Common.prototype.putItem = function (group, item, callback) {
    const params = {
        Item: item,
        TableName: group
    };
    dynamodb.put(params, callback);
};

// Delete item data from DynamoDB
Common.prototype.deleteItem = function (group, id, callback) {
    const params = {
        Key: {id: parseInt(id)},
        TableName: group
    };
    dynamodb.delete(params, callback);
};


module.exports = new Common();