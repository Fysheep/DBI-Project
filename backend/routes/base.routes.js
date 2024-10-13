import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import { defaultUsers } from "../services/crud/nosql/userData.js";
import fs from "node:fs";

async function reset() {
  fs.readFile("./sql/scripts/createDB.sql", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    db.run(data);
  });

  await User.deleteMany({});
}

const baseRouter = express.Router();

baseRouter.get("/reset", async function (req, res, next) {
  try {
    //reset
    await reset();
    res.json({ message: "done" });
  } catch (err) {
    console.error(`Error while resetting `, err.message);
    next(err);
  }
});

baseRouter.get("/base", async function (req, res, next) {
  try {
    //reset
    await reset();
    //insert base SQL
    fs.readFile("./sql/scripts/fillDB.sql", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      db.run(data);
    });

    //insert base NoSQL (bit more complicated, because of unknown Object IDS)
    await User.insertMany(defaultUsers);

    res.json({ message: "done" });
  } catch (err) {
    console.error(`Error while building base `, err.message);
    next(err);
  }
});

/**
 * Puts [Amount] of Users into the MongoDB and measures the time it takes
 * */
async function insertNoSQL(amount) {
  const array = new Array(amount);
  for (let i = 0; i < amount; i++) {
    array[i] = {
      username: `Player${i}`,
      country: "Austria",
      skins: [
        { code: "AAAAAA-000000-000000-000000", name: "black mamba" },
        { code: "AAAAAA-FFFFFF-FFFFFF-FFFFFF", name: "white mamba" },
      ],
    };
  }

  const BATCH_SIZE = 1000;
  const startTimer = Date.now();

  for (let i = 0; i < amount; i += BATCH_SIZE) {
    const batch = array.slice(i, i + BATCH_SIZE);
    await User.insertMany(batch, { ordered: false, validateBeforeSave: false });
  }

  return Date.now() - startTimer;
}

/**
 * Puts [Amount] of Users into the SQLite Database and measures the time it takes
 * */
function insertSQL(amount) {
  const userArray = [];
  const skinArray = [];

  for (let i = 1; i <= amount; i++) {
    userArray[i - 1] = { username: `Player${i}`, country: "Austria" };
    skinArray.push(
      {
        code: "AAAAAA-000000-000000-000000",
        name: "black mamba",
        creator: i,
      },
      {
        code: "AAAAAA-FFFFFF-FFFFFF-FFFFFF",
        name: "white mamba",
        creator: i,
      }
    );
  }

  const userRunString = userArray
    .map((m) => `('${m.username}', '${m.country}')`)
    .join(",");

  const skinRunString = skinArray
    .map((m) => `('${m.code}', '${m.name}', '${m.creator}')`)
    .join(",");

  const startTimer = Date.now();
  db.run(`INSERT INTO users(username, country) VALUES ${userRunString};`);
  db.run(
    `INSERT INTO skins(code, skin_name, creator) VALUES ${skinRunString};`
  );
  return Date.now() - startTimer;
}

baseRouter.get("/test", async function (req, res, next) {
  try {
    /* Test 100 Inserts (Single Entity) */
    await reset();
    const t3 = await insertNoSQL(100);
    const _t3 = insertSQL(100);

    /* Test 1.000 Inserts (Single Entity) */
    await reset();
    const t4 = await insertNoSQL(1_000);
    const _t4 = insertSQL(1_000);

    /* Test 10.000 Inserts (Single Entity)*/
    await reset();
    const t5 = await insertNoSQL(10_000);
    const _t5 = insertSQL(10_000);

    /* Test 100.000 Inserts (Single Entity)*/
    await reset();
    const t6 = await insertNoSQL(100_000);
    const _t6 = insertSQL(100_000);
    /* await reset(); */

    res.json({
      nosql: { t3: t3, t4: t4, t5: t5, t6: t6 },
      sql: { t3: _t3, t4: _t4, t5: _t5, t6: _t6 },
    });
  } catch (err) {
    console.error(`Error while testing`, err.message);
    next(err);
  }
});

export default baseRouter;
