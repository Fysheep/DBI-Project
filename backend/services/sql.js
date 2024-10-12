import sqlite from "better-sqlite3";
import path from "path";

const db = new sqlite(path.resolve("sql/trackmania.db"), {
  fileMustExist: true,
});

function query(sql) {
  return db.prepare(sql);
}

async function run(sql) {
  return db.exec(sql);
}

export default { query, run };
