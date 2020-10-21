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
        createResponse(200,err);
    }
    console.log("Item created successfully.");
    return createResponse(200,'Item Created Successfully.');
};

exports.getAll = async (event) =>{
    let params = {
        TableName: tableName
    }
    let data;
    try{
        data = await dynamo.scan(params).promise();
    }
    catch(err){
        console.log("Error occured"+err);
        createResponse(200,err);
    }
    if(!data.Items ){
        console.log("No items found.");
        return createResponse(200,'No Items Found');
    }
    console.log("Items retrieved successfully.");
    return createResponse(200,JSON.stringify(data.Items));
};

exports.update = async (event) =>{
    let params = {
        TableName: tableName,
        Item: JSON.parse(event.body)
    };
    let data;
    try{
        data = await dynamo.put(params).promise();
    }
    catch(err){
        console.log("Error occured"+err);
        return createResponse(200,err);
    }
    console.log(`Record updated for id = "+${params.Item.todo_id}`);
    return createResponse(200,`Record updated for todo_id = ${params.Item.todo_id}\n`);
};

exports.delete = async (event) =>{
    let eventBody = JSON.parse(event.body);
    let idToDelete = eventBody.id;
    console.log("ID to delete = "+idToDelete);
    let params = {
        TableName: tableName,
        Key:{
            todo_id: idToDelete
        }
    };
    let data;
    try{
        data = await dynamo.delete(params).promise();
    }
    catch(err){
        console.log("Error Occured!"+err);
        return createResponse(200,err);
    }
    console.log(`Record deleted for id = ${idToDelete}`);
    return createResponse(200,`Record deleted for id = ${idToDelete}`);
};