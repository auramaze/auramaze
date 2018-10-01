const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: 'us-east-2'});
const fs = require('fs');
const path = require('path');
const os = require('os');
const mysql = require('mysql');
const rds = mysql.createConnection(JSON.parse(fs.readFileSync(path.join(os.homedir(), '.aws/rds'), 'utf8')));
const franc = require('franc-min');
const convert3To1 = require('iso-639-3-to-1');

function Common() {
}

Common.prototype.dynamodb = dynamodb;
Common.prototype.rds = rds;

// Check if username satisfies variants
Common.prototype.validateUsername = username => Boolean(username.match(/^(?!.*--)[a-z][a-z0-9-]{1,48}[a-z0-9]$/));

// Insert username into Aurora table `art` or `artizen`
Common.prototype.insertUsername = (group, username, callback) => {
    rds.query(`INSERT INTO ${group} (username) VALUES (?)`, [username], (err, result, fields) => {
        /* istanbul ignore if */
        if (err) {
            callback(err, result, fields);
        } else {
            rds.query('SELECT LAST_INSERT_ID() AS id', callback);
        }
    });
};

// Get item data from DynamoDB
Common.prototype.getItem = (group, id, callback) => {
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