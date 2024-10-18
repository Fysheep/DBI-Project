import mysql from "mysql2"; // Use the promise-based version for async operations

const db_mysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NheWdBgk^3pksMvWOSM9",
  database: "trackmania", // Make sure to specify your database here
});

function connect() {
  db_mysql.connect();
  console.log("(MYSQL) => Connected");
  return db_mysql;
}

function disconnect() {
  db_mysql.end();
  console.log("(MYSQL) => Closed");
}

// Example to execute queries, you can use this directly
db_mysql.run = function (sql, params) {
  return db_mysql.execute(sql, params);
};

export default db_mysql;
export { connect, disconnect };
