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

    const allOptionsResult = await client.query(
      q.Let(
        {
          bets_value_name: q.Map(
            q.Paginate(q.Documents(q.Collection('bets'))),
            q.Lambda(['bet'], {
              value: q.Select(['data', 'value'], q.Get(q.Var('bet'))),
              option: q.Select(['data', 'option'], q.Get(q.Var('bet'))),
            }),
          ),
          bets_sum_by_option: q.Map(
            q.Paginate(q.Documents(q.Collection('options'))),
            q.Lambda(
              ['option'],
              [
                q.Select(['id'], q.Var('option')),
                q.Select(
                  [0],
                  q.Sum(
                    q.Map(
                      q.Filter(
                        q.Var('bets_value_name'),
                        q.Lambda(
                          ['bet'],
                          q.Equals(
                            q.Select(['id'], q.Var('option')),
                            q.Select(['option', 'id'], q.Var('bet')),
                          ),
                        ),
                      ),
                      q.Lambda(['option_bet'], q.Select(['value'], q.Var('option_bet'))),
                    ),
                  ),
                ),
              ],
            ),
          ),
        },
        q.Map(
          q.Paginate(q.Match(q.Index('all_options'))),
          q.Lambda('option', {
            id: q.Select([0, 'id'], q.Var('option')),
            name: q.Select([1], q.Var('option')),
            numberOfBets: q.Select(
              [0, 1],
              q.Filter(
                q.Var('bets_sum_by_option'),
                q.Lambda(
                  'bet',
                  q.Equals(q.Select([0], q.Var('bet')), q.Select([0, 'id'], q.Var('option'))),
                ),
              ),
            ),
          }),
        ),
      ),
    );

    const allOptions = allOptionsResult.data;

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
