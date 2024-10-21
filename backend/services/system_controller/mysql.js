import mysql from "mysql2";

const db_mysql = mysql.createConnection({
  host: "localhost",
  port: 63636,
  user: "root",
  password: "NheWdBgk^3pksMvWOSM9",
  database: "trackmania",
});

function connect() {
  db_mysql.connect();
  console.log("%c(MYSQL) => Connected", "color:red");
  return db_mysql;
}

function disconnect() {
  db_mysql.end();
  console.log("(MYSQL) => Closed");
}

db_mysql.run = function (sql, params) {
  return db_mysql.execute(sql, params);
};

export default db_mysql;
export { connect, disconnect };
