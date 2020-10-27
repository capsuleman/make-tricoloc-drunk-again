const faunadb = require('faunadb');
const bcrypt = require('bcrypt');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 404,
        body: 'Not found',
      };
    }

    const { username, password } = JSON.parse(event.body);
    const userItem = {
      data: { username, password: await bcrypt.hash(password, saltRounds) },
    };
    await client.query(
      q.Create(q.Collection('users'), userItem)
    );

    return {
      statusCode: 201,
      body: 'User created!',
    };
  } catch (error) {
    if (error.message === 'instance not unique') {
      return {
        statusCode: 409,
        body: 'Username already taken.',
      };
    }
    console.log(error);
    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
