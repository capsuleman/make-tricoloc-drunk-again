const faunadb = require('faunadb');
const { tokenToUsername } = require('./services');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

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

    const user = await client.query(q.Get(q.Match(q.Index('users_by_username'), username)));
    if (!user) {
      return {
        statusCode: 404,
        body: 'User not found.',
      };
    }

    const { firstname, lastname, isNikingMarine } = user.data;

    if (!username) {
      return {
        statusCode: 401,
        body: 'Wrong or expired JWT',
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ username, firstname, lastname, isNikingMarine }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
