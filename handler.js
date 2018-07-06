import UUID from "uuid";
import AWS from "aws-sdk";

AWS.config.update({
  region: 'us-east-1',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

function handleError(callaback, headers, message) {
  callback(null, {
    statusCode: 500,
    headers,
    body: JSON.stringify({
      status: false,
      message
    })
  });
  return;
};

function handleResponse(callback, body, headers) {
  callback(null, {
    statusCode: 200,
    headers,
    body,
  });
  return;
}


export function create (
  event,
  context,
  callback
) {
  const { dateCreated, name, content } = JSON.parse(event.body);

  const params = {
    TableName: "article",
    Item: {
      articleId: UUID.v1(),
      dateCreated,
      name,
      content
    }
  };

  dynamoDb.put(params, (err, data) => {
    if(err) handleError(callback, headers);

    //  no err
    const body = JSON.stringify(params.Item);
    handleResponse(callback, body, headers);
  });
}

//  get an Article overview
export function getArticles(
  event,
  context,
  callback
) {  
  const params = {
    // ProjectionExpression: "name, dateCreated, articleId",
    TableName: "article",
  };

  dynamoDb.scan(params, (err, data) => { 
    if (err) handleError(callback, headers, `unable to retrieve articles ${err}`);
    
    const items = data.Items.map(item => ({ name: item.name, dateCreated: item.dateCreated }));
    const body = JSON.stringify(items);
    handleResponse(callback, body, headers);
  });
  return;
}


//  get a specific article
export function getArticle(
  event,
  context,
  callback
) {
  const { articleId } = event.pathParameters;

  const params = {
    TableName: "article",
    Key: {
      "articleId": parseInt(articleId)
    }
  };

  dynamoDb.get(params, (err, data) => {
    if(err) handleError(callback, headers, `unable to retrieve article ${articleId}, ${err}`);
    const body = JSON.stringify(data);
    handleResponse(callback, body, headers);
  });
  return;
}


export function alive (
  event,
  context,
  callback
) {
  const response = JSON.stringify({
    alive: true
  });
  handleResponse(callback, response, headers);
  return;
}