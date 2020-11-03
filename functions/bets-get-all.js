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

    const allBetsResult = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_bets')), { size: 20 }),
        q.Lambda(
          'bet',
          q.Let(
            {
              bet_doc: q.Get(q.Select([1], q.Var('bet'))),
              user: q.Get(q.Select(['data', 'user'], q.Var('bet_doc'))),
            },
            {
              username: q.Select(['data', 'username'], q.Var('user')),
              firstname: q.Select(['data', 'firstname'], q.Var('user')),
              lastname: q.Select(['data', 'lastname'], q.Var('user')),
              optionName: q.Select(
                ['data', 'name'],
                q.Get(q.Select(['data', 'option'], q.Var('bet_doc'))),
              ),
              value: q.Select(['data', 'value'], q.Var('bet_doc')),
              time: q.Select(['ts'], q.Var('bet_doc')),
            },
          ),
        ),
      ),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(allBetsResult.data),
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
