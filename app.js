const express = require('express');
const app = express();
require('dotenv').config();

var AWS = require('aws-sdk');

app.get('/', (req, res) => {

    console.log("Message = " + req.query.message);
    console.log("Number = " + req.query.number);
    console.log("Subject = " + req.query.subject);
    var params = {
        Message: req.query.message,
        PhoneNumber: '+' + req.query.number,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': req.query.subject
            }
        }
    };

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            res.end(JSON.stringify({ MessageID: data.MessageId }));
        }).catch(
            function (err) {
                res.end(JSON.stringify({ Error: err }));
            });

});

app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))