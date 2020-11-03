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
      q.Let(
        {
          bets_value_name: q.Map(
            q.Paginate(q.Documents(q.Collection('bets'))),
            q.Lambda(['bet'], {
              value: q.Select(['data', 'value'], q.Get(q.Var('bet'))),
              option: q.Select(['data', 'option'], q.Get(q.Var('bet'))),
            }),
          ),
          bets_sum: q.ToDouble(
            q.Select(
              [0],
              q.Sum(
                q.Map(
                  q.Var('bets_value_name'),
                  q.Lambda(['bet'], q.Select(['value'], q.Var('bet'))),
                ),
              ),
            ),
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
          odds: q.Map(
            q.Var('bets_sum_by_option'),
            q.Lambda(
              ['option_id', 'bet_sum_by_option'],
              [q.Var('option_id'), q.Divide(q.Var('bets_sum'), q.Var('bet_sum_by_option'))],
            ),
          ),
        },
        q.Map(
          q.Paginate(q.Match(q.Index('all_bets')), { size: 20 }),
          q.Lambda(
            'bet',
            q.Let(
              {
                bet_doc: q.Get(q.Select([1], q.Var('bet'))),
                user: q.Get(q.Select(['data', 'user'], q.Var('bet_doc'))),
                odd: q.Select(
                  [0, 1],
                  q.Filter(
                    q.Var('odds'),
                    q.Lambda(
                      ['option_id', 'odd'],
                      q.Equals(
                        q.Var('option_id'),
                        q.Select(['data', 'option', 'id'], q.Var('bet_doc')),
                      ),
                    ),
                  ),
                ),
                numberOfShotBet: q.Select(['data', 'value'], q.Var('bet_doc')),
              },
              {
                username: q.Select(['data', 'username'], q.Var('user')),
                firstname: q.Select(['data', 'firstname'], q.Var('user')),
                lastname: q.Select(['data', 'lastname'], q.Var('user')),
                optionName: q.Select(
                  ['data', 'name'],
                  q.Get(q.Select(['data', 'option'], q.Var('bet_doc'))),
                ),
                numberOfShotBet: q.Var('numberOfShotBet'),
                numberOfShotIfWin: q.Multiply(q.Var('odd'), q.Var('numberOfShotBet')),
                time: q.Select(['ts'], q.Var('bet_doc')),
              },
            ),
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
