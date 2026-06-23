const { Client } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/DATABASE_URL="([^"]+)"/);
if (!match) { console.error('No DATABASE_URL found'); process.exit(1); }

const client = new Client({ connectionString: match[1] });

client.connect()
  .then(() => client.query('SELECT id, code, name, weight, type FROM "Criteria" ORDER BY code'))
  .then(result => {
    console.log(JSON.stringify(result.rows, null, 2));
    return client.end();
  })
  .catch(err => {
    console.error(err.message);
    client.end();
  });
