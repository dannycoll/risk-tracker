// const { logger } = require("../logger/logger");

const knexConn = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});
knexConn.schema.hasTable("users").then(function (exists) {
  // logger.info("Looking for users table");
  if (!exists) {
    // logger.info("Creating users table");
    return knexConn.schema.createTable("users", function (t) {
      t.increments("id").primary();
      t.string("username", 100);
      t.string("riskId", 100);
    });
  }
});
knexConn.schema.hasTable("stats").then(function (exists) {
  // logger.info("Looking for users table");
  if (!exists) {
    // logger.info("Creating users table");
    return knexConn.schema.createTable("users", function (t) {
      t.increments("id").primary();
      t.string("riskId", 100);
      t.number("ffaSkillPoints");
      t.number("ffaPosition");
      t.number("OnevOneSkillPoints");
      t.number("OnevOnePosition");
      t.string("time");
    });
  }
});
module.exports = knexConn;
