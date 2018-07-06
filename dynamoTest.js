const AWS = require("aws-sdk");
const UUID = require('uuid');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function test() {

  const params = {
    TableName: "article",
  };

  dynamoDb.scan(params, (err, data) => { 
    if (err) console.log(err);

    console.log(data)

  });
}

test();
