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

    const [allBetsData, allOptions] = await Promise.all([
      client.query(
        q.Map(
          q.Map(
            q.Paginate(q.Documents(q.Collection('bets'))),
            q.Lambda('bet', q.Get(q.Var('bet'))),
          ),
          q.Lambda('bet', {
            time: q.Select(['ts'], q.Var('bet')),
            numberOfShots: q.Select(['data', 'value'], q.Var('bet')),
            optionId: q.Select(['data', 'option', 'id'], q.Var('bet')),
          }),
        ),
      ),
      client.query(
        q.Map(
          q.Paginate(q.Match(q.Index('all_options'))),
          q.Lambda('option', {
            id: q.Select([0, 'id'], q.Var('option')),
            name: q.Select([1], q.Var('option')),
          }),
        ),
      ),
    ]);
    const times = allBetsData.data.map((bet) => bet.time);
    const minTime = Math.min(...times);
    const chartData = allOptions.data.map((option) => {
      var cumulatedValue = 0;
      const optionData = allBetsData.data
        .filter((bet) => bet.optionId === option.id)
        .map((bet) => {
          cumulatedValue += bet.numberOfShots;
          return { time: bet.time, cumulatedValue };
        });

      return {
        id: option.id,
        name: option.name,
        data: [
          ...(optionData[0].time !== minTime ? [{ time: minTime, cumulatedValue: 0 }] : []),
          ...optionData,
        ],
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(chartData),
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
