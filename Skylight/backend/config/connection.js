const snowflake = require("snowflake-sdk");
require("dotenv").config();

const account = process.env.SNOWFLAKE_ACCOUNT;
const user = process.env.SNOWFLAKE_USERNAME;
const password = process.env.SNOWFLAKE_PASSWORD;
const database = process.env.SNOWFLAKE_DATABASE;
const schema = process.env.SNOWFLAKE_SCHEMA;

const connection = snowflake.createConnection({
  account: account,
  username: user,
  password: password,
  database: database,
  schema: schema
});

const connectPromise = new Promise((resolve, reject) => {
  connection.connect((err, conn) => {
    if (err) {
      console.error("Unable to connect: " + err.message);
      reject(err);
    } else {
      console.log("Successfully connected to Snowflake.");
      resolve(conn);
    }
  });
});

module.exports = connection;
