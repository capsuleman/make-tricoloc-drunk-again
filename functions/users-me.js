const { tokenToUsername } = require('./services');

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 404,
        body: 'Not found',
      };
    }

    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.includes('Bearer ')) {
      return {
        statusCode: 401,
        body: 'JWT missing.',
      };
    }

    const token = authHeader.substring(7);
    const username = tokenToUsername(token);

    if (!username) {
        return {
          statusCode: 401,
          body: 'Wrong or expired JWT',
        };
      }
  
    return {
      statusCode: 200,
      body: JSON.stringify({ username }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
