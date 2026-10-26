require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

async function realizarQuery(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { realizarQuery };