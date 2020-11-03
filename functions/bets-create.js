const faunadb = require('faunadb');
const { tokenToUsername } = require('./services');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
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

    const { value, option } = JSON.parse(event.body);

    const isOptionExist = await client.query(q.Exists(q.Ref(q.Collection('options'), option)));

    if (!isOptionExist) {
      return {
        statusCode: 404,
        body: 'Option not found.',
      };
    }

    const newBetQuery = q.Let(
      {
        user: q.Select('ref', q.Get(q.Match(q.Index('users_by_username'), username))),
        option: q.Ref(q.Collection('options'), option),
      },
      q.Create(q.Collection('bets'), {
        data: {
          user: q.Var('user'),
          value,
          option: q.Var('option'),
        },
      }),
    );

    await client.query(newBetQuery);

    return {
      statusCode: 201,
      body: 'Created!',
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
