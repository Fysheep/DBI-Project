import sqlite from "better-sqlite3";
import path from "path";
import fs from "node:fs";

const pathResult = path.resolve("db/trackmania.db");

fs.writeFile(pathResult, "", { flag: "wx" }, () => {});

const db_sqlite = new sqlite(pathResult, {
  fileMustExist: true,
});
console.log("(SQLITE) => Connected");

db_sqlite.query = function (sql, params = []) {
  return db_sqlite.prepare(sql).all(params);
};

db_sqlite.run = function (sql) {
  return db_sqlite.exec(sql);
};

export default db_sqlite;
