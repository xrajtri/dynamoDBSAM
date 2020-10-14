const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

const createResponse = (statusCode,body) => {
    return {
        statusCode: statusCode,
        body: body,
        headers:{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }
    }
}

exports.create = async (event) =>{
    let body = JSON.parse(event.body);
    let params = {
        TableName: tableName,
        Item: JSON.parse(event.body)
    };
    let data;
    try{
        data = await dynamo.put(params).promise();
    }
    catch(err){
        console.log('Error occured'+err);
    }
    console.log("Item created successfully.");
    return createResponse(200,'Item Created Successfully.');
}