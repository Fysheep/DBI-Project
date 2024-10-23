import sqlite from "better-sqlite3";
import path from "path";
import fs from "node:fs";
import cs from "../tools/log.js";

function genSqlite(db) {
  db.query = function (sql, params = []) {
    return db.prepare(sql).all(params);
  };

  db.run = function (sql) {
    return db.exec(sql);
  };
}

async function connect() {
  try {
    const pathResult = path.resolve("trackmania.db");

    fs.writeFile(pathResult, "", { flag: "wx" }, () => {});

    const db_sqlite = new sqlite(pathResult, {
      fileMustExist: true,
    });

    genSqlite(db_sqlite);

    cs.log(["magenta", `(SQLITE)`], ["white", `     => `], ["green", `Connected`]);

    return db_sqlite;
  } catch {
    cs.log(
      ["magenta", `(SQLITE)`],
      ["white", `     => `],
      ["red", `Could not Connect`]
    );
  }
}

const db = await connect();

export default db;
export { connect };
