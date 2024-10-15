import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import nosqlTestData from "../services/crud/nosql/userData.js";
import RefSkin from "../services/crud/ref_nosql/skins.js";
import RefUser from "../services/crud/ref_nosql/users.js";
import refnosqlTestData from "../services/crud/ref_nosql/userData.js";
import queries from "./testfolder/teststrings.js";
import fs from "node:fs";

const testRouter = express.Router();

async function delete_SQL() {
  const timer = Date.now();
  db.run(`DELETE FROM users;`);
  db.run(`DELETE FROM skins;`);
  return Date.now() - timer;
}

async function delete_NoSQL() {
  const timer = Date.now();
  await User.deleteMany({});
  return Date.now() - timer;
}

async function reset() {
  fs.readFile("./sql/scripts/createDB.sql", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    db.run(data);
  });

  await delete_NoSQL();
}

/**
 * Puts [Amount] of Users into the MongoDB
 * */
async function insertNoSQL(amount) {
  const usersToInsert = [];

  for (let i = 0; i < amount; i++) {
    const user =
      nosqlTestData.defaultUsers[i % nosqlTestData.defaultUsers.length]; // Use modulo to loop over the predefined dataset
    usersToInsert.push(user);
  }

  await User.insertMany(usersToInsert);
}

/**
 * Puts [Amount] of Users into the Referencing MongoDB
 * */
async function insertRefNoSQL(amount) {
  for (let i = 0; i < amount; i++) {
    const user =
      refnosqlTestData.defaultUsers[i % refnosqlTestData.defaultUsers.length]; // Modulo to loop over dataset
    const insertedUser = await RefUser.create(user);

    const skinsForUser = refnosqlTestData.defaultSkins.filter(
      (skin) => skin.username === user.username
    );
    const skinsToInsert = skinsForUser.map((skin) => ({
      code: skin.code,
      name: skin.name,
      creatorId: insertedUser._id, // Reference to the user
    }));

    await RefSkin.insertMany(skinsToInsert);
  }
}

/**
 * Puts [Amount] of Users into the SQLite Database
 * */
function insertSQL(amount) {
  
}

async function measure(f) {
  const timer = Date.now();
  const ans = await f();
  return [Date.now() - timer, ans];
}

async function testBySize(size) {
  await reset();
  await insertNoSQL(size);
  await insertRefNoSQL(size);
  insertSQL(size);

  // [x][x] Find({})
  const _f1 = await measure(async () => {
    return db.query(queries.f1);
  });
  const f1 = await measure(async () => {
    return await User.find({});
  });

  // [x][x] Find(Filter)
  const _f2 = await measure(async () => {
    return db.query(queries.f2);
  });
  const f2 = await measure(async () => {
    return await User.find({ country: "Austria" });
  });

  // [x][x]	Find(Filter, Projection)
  const _f3 = await measure(async () => {
    return db.query(queries.f3);
  });
  const f3 = await measure(async () => {
    return await User.find({ country: "Austria" }, { id: 1, username: 1 });
  });

  // [x][x]	Find(Filter, Projection, Sorting)
  const _f4 = await measure(async () => {
    return db.query(queries.f4);
  });
  const f4 = await measure(async () => {
    return await User.find({ country: "Austria" }, { id: 1, username: 1 }).sort(
      {
        _id: -1,
      }
    );
  });

  // [x][x] Aggregate count skins of user
  const _a1 = await measure(async () => {
    return db.query(queries.a1);
  });
  const a1 = await measure(async () => {
    return await User.aggregate([
      {
        $match: { username: "Fyshi" },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          numOfSkins: { $size: "$skins" },
        },
      },
    ]);
  });

  const _t1 = await measure(async () => {
    return db.query(queries.t1);
  });

  const t1 = await measure(async () => {
    return await User.aggregate([
      {
        $search: {
          index: "volltextsuche",
          text: {
            query: "Austria",
            path: {
              wildcard: "*",
            },
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
    ]);
  });

  // [x][x]	Update One
  const _u1 = await measure(async () => {
    return db.run(queries.u1);
  });
  const u1 = await measure(async () => {
    return await User.updateOne(
      { username: "Player1" },
      { $set: { comp_points: 100 } }
    );
  });

  // [x][x]	Update All
  const _u2 = await measure(async () => {
    return db.run(queries.u2);
  });
  const u2 = await measure(async () => {
    return await User.updateMany({}, { $set: { comp_points: 999 } });
  });

  // [x][x]	Delete One
  const _d1 = await measure(async () => {
    return db.run(queries.d1);
  });
  const d1 = await measure(async () => {
    return await User.deleteOne({ username: "Player0" });
  });

  // [x][x]	Delete All
  const _d2 = await measure(async () => {
    return db.run(queries.d2);
  });
  const d2 = await measure(async () => {
    return await User.deleteMany({});
  });

  await reset();

  return {
    size: size,
    times: {
      sql: {
        find_all: _f1[0],
        find_filter: _f2[0],
        find_filter_projection: _f3[0],
        find_filter_projection_sort: _f4[0],
        aggregate: _a1[0],
        text_search: _t1[0],
        update_one: _u1[0],
        update_all: _u2[0],
        delete_one: _d1[0],
        delete_all: _d2[0],
      },
      nosql: {
        find_all: f1[0],
        find_filter: f2[0],
        find_filter_projection: f3[0],
        find_filter_projection_sort: f4[0],
        aggregate: a1[0],
        text_search: t1[0],
        update_one: u1[0],
        update_all: u2[0],
        delete_one: d1[0],
        delete_all: d2[0],
      },
      ref_nosql: {
        find_all: ref_f1[0],
        find_filter: ref_f2[0],
        find_filter_projection: ref_f3[0],
        find_filter_projection_sort: ref_f4[0],
        aggregate: ref_a1[0],
        text_search: ref_t1[0],
        update_one: ref_u1[0],
        update_all: ref_u2[0],
        delete_one: ref_d1[0],
        delete_all: ref_d2[0],
      },
    },
    results: {
      sql: {
        find_all: _f1[1],
        find_filter: _f2[1],
        find_filter_projection: _f3[1],
        find_filter_projection_sort: _f4[1],
        aggregate: _a1[1],
        text_search: _t1[1],
        update_one: _u1[1],
        update_all: _u2[1],
        delete_one: _d1[1],
        delete_all: _d2[1],
      },
      nosql: {
        find_all: f1[1],
        find_filter: f2[1],
        find_filter_projection: f3[1],
        find_filter_projection_sort: f4[1],
        aggregate: a1[1],
        text_search: t1[1],
        update_one: u1[1],
        update_all: u2[1],
        delete_one: d1[1],
        delete_all: d2[1],
      },
      ref_nosql: {
        find_all: ref_f1[1],
        find_filter: ref_f2[1],
        find_filter_projection: ref_f3[1],
        find_filter_projection_sort: ref_f4[1],
        aggregate: ref_a1[1],
        text_search: ref_t1[1],
        update_one: ref_u1[1],
        update_all: ref_u2[1],
        delete_one: ref_d1[1],
        delete_all: ref_d2[1],
      },
    },
  };
}

testRouter.get("/basic", async function (req, res, next) {
  try {
    const s = parseInt(req.query.size) ?? 10;
    const size = s > 9 ? s : 10;

    const ans = await testBySize(size);

    res.json(ans);
  } catch (err) {
    console.error(`Error while testing`, err.message);
    next(err);
  }
});

testRouter.get("/advanced", async function (req, res, next) {
  try {
    const ans1 = await testBySize(100);
    const ans2 = await testBySize(1000);
    const ans3 = await testBySize(10000);
    /* Too Much (takes ~ 5 minutes) */
    /* const ans4 = await testBySize(100000); */

    res.json({ 100: ans1, 1000: ans2, 10000: ans3, 100000: ans4 });
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

export default testRouter;
