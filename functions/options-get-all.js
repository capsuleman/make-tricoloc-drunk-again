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

    if (!username) {
      return {
        statusCode: 401,
        body: 'Wrong or expired JWT',
      };
    }

    const allOptionsResult = await client.query(q.Paginate(q.Match(q.Index('all_options'))));
    const allOptions = allOptionsResult.data.map(([ref, name]) => ({ id: ref.id, name }));

    return {
      statusCode: 200,
      body: JSON.stringify(allOptions),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
