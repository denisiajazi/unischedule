// db.js — lidhja me bazën e të dhënave MySQL (pool + transaksione)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "unischedule",
  waitForConnections: true,
  connectionLimit: 10,
});

async function query(sql, params = []) {
  const [rreshtat] = await pool.query(sql, params);
  return rreshtat;
}

async function fillimoTransaksion() {
  const lidhja = await pool.getConnection();
  await lidhja.beginTransaction();
  return {
    query: (sql, p = []) => lidhja.query(sql, p),
    commit: () => lidhja.commit(),
    rollback: () => lidhja.rollback(),
    release: () => lidhja.release(),
  };
}

module.exports = { query, fillimoTransaksion, pool };
