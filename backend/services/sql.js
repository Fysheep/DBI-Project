import sqlite from "better-sqlite3";
import path from "path";

const db = new sqlite(path.resolve("sql/trackmania.db"), {
  fileMustExist: true,
});

db.query = function (sql, params = []) {
  return db.prepare(sql).all(params);
};

db.run = function (sql) {
  return db.exec(sql);
};

export default db;
