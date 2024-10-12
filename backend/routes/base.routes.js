import express from "express";
import db from "../services/sql.js";
import User, { defaultUsers } from "../services/crud/nosql/users.js";
import Skin, { defaultSkins } from "../services/crud/nosql/skins.js";
import Map, { defaultMaps } from "../services/crud/nosql/maps.js";
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
  await Skin.deleteMany({});
  await Map.deleteMany({});
}

const baseRouter = express.Router();

baseRouter.get("/reset", async function (req, res, next) {
  try {
    //reset
    await reset();
    res.json({ code: 200 });
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
    const users = await User.insertMany(defaultUsers);

    //Structured Clone to cut connection
    const maps = structuredClone(defaultMaps);
    maps.map((m) => {
      m.creator = users.find((f) => f.username == m.creator)._id;
      return m;
    });
    await Map.insertMany(maps);

    //Structured Clone to cut connection
    const skins = structuredClone(defaultSkins);
    skins.map((m) => {
      m.creator = users.find((f) => f.username == m.creator)._id;
      return m;
    });
    await Skin.insertMany(skins);

    res.json(await User.find());
  } catch (err) {
    console.error(`Error while building base `, err.message);
    next(err);
  }
});

async function insertNoSQL(amount) {
  const array = [];

  for (let i = 0; i <= amount; i++) {
    array.push({ username: `Player${i}`, country: "Austria" });
  }
  const startTimer = Date.now();
  await User.insertMany(array);
  return Date.now() - startTimer;
}

function insertSQL(amount) {
  const array = [];

  for (let i = 0; i < amount; i++) {
    array.push({ username: `Player${i}`, country: "Austria" });
  }
  const startTimer = Date.now();
  db.run(
    `INSERT INTO users(username, country) VALUES ${array
      .map((m) => `('${m.username}', '${m.country}')`)
      .join(",")};`
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

    await reset();

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
