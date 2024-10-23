import mysql from "mysql2";
import cs from "../tools/log.js";

const db_mysql = mysql.createConnection({
  host: "localhost",
  port: 63636,
  user: "root",
  password: "NheWdBgk^3pksMvWOSM9",
  database: "trackmania",
});

async function connect() {
  try {
    db_mysql.connect();

    cs.log(["magenta", `(MYSQL)`], ["white", `      => `], ["green", `Connected`]);
  } catch {
    cs.log(
      ["magenta", `(SQLITE)`],
      ["white", `      => `],
      ["red", `Could not Connect`]
    );
  }
}

function disconnect() {
  db_mysql.end();
}

export default db_mysql;
export { connect, disconnect };
