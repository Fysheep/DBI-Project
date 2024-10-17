import sqlite from "better-sqlite3";
import path from "path";
import fs from "node:fs";

const pathResult = path.resolve("sql/trackmania.db");

fs.writeFile(pathResult, "", { flag: "wx" }, () => {});

const db = new sqlite(pathResult, {
  fileMustExist: true,
});

db.query = function (sql, params = []) {
  return db.prepare(sql).all(params);
};

db.run = function (sql) {
  return db.exec(sql);
};

export default db;
