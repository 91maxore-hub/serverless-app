const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const db = new DynamoDBClient({ region: "eu-west-1" });

exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://dttru2ys9r817.cloudfront.net",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: ""
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    console.error("JSON parse error:", e);
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "https://dttru2ys9r817.cloudfront.net" },
      body: JSON.stringify({ error: "Invalid JSON in request" })
    };
  }

  const id = crypto.randomUUID();

  const params = {
    TableName: "ContactFormMessages",
    Item: {
      id: { S: id },
      name: { S: data.name || "UNKNOWN" },
      email: { S: data.email || "UNKNOWN" },
      message: { S: data.message || "EMPTY" },
      createdAt: { S: new Date().toISOString() }
    }
  };

  try {
    console.log("Trying to write to Dynamo:", params);
    await db.send(new PutItemCommand(params));
    console.log("Write SUCCESS");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://dttru2ys9r817.cloudfront.net",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        success: true,
        id,
        ...data
      })
    };

  } catch (err) {
    console.error("DynamoDB ERROR:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://dttru2ys9r817.cloudfront.net"
      },
      body: JSON.stringify({ error: "Could not save message", details: err.message })
    };
  }
};