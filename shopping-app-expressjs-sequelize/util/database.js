// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER,
//   database: process.env.DB,
//   password: process.env.PASSWORD,
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;
