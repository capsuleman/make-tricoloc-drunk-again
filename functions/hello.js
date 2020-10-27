exports.handler = async function (event, context) {
  const echoMessage = event.queryStringParameters.message;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!', echo: echoMessage }),
  };
};
