/* bootstrap database in your FaunaDB account */
const readline = require('readline');
const faunadb = require('faunadb');
const chalk = require('chalk');
const insideNetlify = insideNetlifyBuildContext();
const q = faunadb.query;
const dotenv = require('dotenv');
dotenv.config();

console.log(chalk.cyan('Creating your FaunaDB Database...\n'));

// 1. Check for required enviroment variables
if (!process.env.FAUNADB_SECRET) {
  console.log(chalk.yellow('Required FAUNADB_SECRET enviroment variable not found.'));
  if (insideNetlify) {
    console.log(`Visit https://app.netlify.com/sites/YOUR_SITE_HERE/settings/deploys`);
    console.log('and set a `FAUNADB_SECRET` value in the "Build environment variables" section');
    process.exit(1);
  }
  // Local machine warning
  if (!insideNetlify) {
    console.log();
    console.log('You can create fauna DB keys here: https://dashboard.fauna.com/db/keys');
    console.log();
    ask(chalk.bold('Enter your faunaDB server key'), (err, answer) => {
      if (!answer) {
        console.log('Please supply a faunaDB server key');
        process.exit(1);
      }
      createFaunaDB(process.env.FAUNADB_SECRET);
    });
  }
}

// Has var. Do the thing
if (process.env.FAUNADB_SECRET) {
  createFaunaDB(process.env.FAUNADB_SECRET);
}

/* idempotent operation */
async function createFaunaDB(key) {
  console.log('Creating the database!');
  const client = new faunadb.Client({
    secret: key,
  });

  /* Based on your requirements, change the schema here */
  try {
    await client.query(q.CreateCollection({ name: 'users' }));
    await client.query(
      q.CreateIndex({
        name: 'users_by_username',
        source: q.Collection('users'),
        terms: [{ field: ['data', 'username'] }],
        unique: true,
      }),
    );
    console.log('Database Users created');
  } catch (e) {
    // Database already exists
    if (e.requestResult.statusCode === 400 && e.message === 'instance already exists') {
      console.log('DB Users already exists');
    }
  }

  try {
    await client.query(q.CreateCollection({ name: 'options' }));
    await client.query(
      q.CreateIndex({
        name: 'all_options',
        source: q.Collection('options'),
        values: [{ field: ['ref'] }, { field: ['data', 'name'] }],
      }),
    );
    await client.query(
      q.CreateIndex({
        name: 'options_by_name',
        source: q.Collection('options'),
        terms: [{ field: ['data', 'name'] }],
        unique: true,
      }),
    );
    console.log('Database Options created');
  } catch (e) {
    // Database already exists
    if (e.requestResult.statusCode === 400 && e.message === 'instance already exists') {
      console.log('DB Option already exists');
    }
  }

  try {
    await client.query(q.CreateCollection({ name: 'bets' }));
    await client.query(
      q.CreateIndex({
        name: 'all_bets',
        source: q.Collection('bets'),
        values: [
          {
            field: ['ts'],
            reverse: true,
          },
          {
            field: ['ref'],
          },
        ],
      }),
    );
    await client.query(
      q.CreateIndex({
        name: 'bets_by_user',
        source: q.Collection('bets'),
        terms: [{ field: ['data', 'user'] }],
      }),
    );
    await client.query(
      q.CreateIndex({
        name: 'bets_by_option',
        source: q.Collection('bets'),
        terms: [{ field: ['data', 'option'] }],
      }),
    );
    console.log('Database Bets created');
  } catch (e) {
    // Database already exists
    if (e.requestResult.statusCode === 400 && e.message === 'instance already exists') {
      console.log('DB Bets already exists');
    }
  }
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true;
  }
  return false;
}

// Readline util
function ask(question, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(question + '\n', function (answer) {
    rl.close();
    callback(null, answer);
  });
}
