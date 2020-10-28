const faunadb = require('faunadb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    if (!authHeader || !authHeader.includes('Basic ')) {
      return {
        statusCode: 401,
        body: 'Please authentificate',
      };
    }

    const encodedCredentials = authHeader.substring(6);
    const credentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [username, password] = credentials.split(':');

    const response = await client.query(
      q.Get(q.Match(q.Index('users_by_username'), username))
    );
    const hashedPassword = response.data.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: 'Wrong password',
      };
    }

    const token = jwt.sign({ username }, process.env.SUPER_JWT_SECRET, {
      expiresIn: 24 * 60 * 60,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    if (error.message === 'instance not found') {
      return {
        statusCode: 404,
        body: 'No user with this username.',
      };
    }
    console.log(error);

    return {
      statusCode: 500,
      body: 'Fuck.',
    };
  }
};
