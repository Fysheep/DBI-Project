import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import nosqlTestData from "../services/crud/nosql/userData.js";
import RefSkin from "../services/crud/ref_nosql/skins.js";
import RefUser from "../services/crud/ref_nosql/users.js";
import refnosqlTestData from "../services/crud/ref_nosql/userData.js";
import queries from "./testfolder/teststrings.js";
import fs from "node:fs";
import Test from "../services/crud/test_saving/tests.js";

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
  const start = Date.now();
  const usersToInsert = [];

  for (let i = 0; i < amount; i++) {
    const user =
      nosqlTestData.defaultUsers[i % nosqlTestData.defaultUsers.length]; // Use modulo to loop over the predefined dataset
    usersToInsert.push(user);
  }

  await User.insertMany(usersToInsert, {
    validateBeforeSave: false,
    ordered: false,
  });
  return Date.now() - start;
}

/**
 * Puts [Amount] of Users into the Referencing MongoDB
 * */
async function insertRefNoSQL(amount) {
  const start = Date.now();

  const usersToInsert = [];
  for (let i = 0; i < amount; i++) {
    const userTemplate =
      refnosqlTestData.defaultUsers[i % refnosqlTestData.defaultUsers.length];
    usersToInsert.push({ ...userTemplate });
  }

  const insertedUsers = await RefUser.insertMany(usersToInsert, {
    ordered: false,
  });

  const skinsToInsert = [];
  for (const user of insertedUsers) {
    const skinsForUser = refnosqlTestData.defaultSkins.filter(
      (skin) => skin.username === user.username
    );

    const userSkins = skinsForUser.map((skin) => ({
      code: skin.code,
      name: skin.name,
      creatorId: user._id,
    }));

    skinsToInsert.push(...userSkins);
  }

  if (skinsToInsert.length > 0) {
    await RefSkin.insertMany(skinsToInsert, {
      validateBeforeSave: false,
      ordered: false,
    });
  }

  return Date.now() - start;
}

/**
 * Puts [Amount] of Users into the SQLite Database
 * */
function insertSQL(amount) {
  const start = Date.now();

  const userArray = [];
  const skinArray = [];
  for (let i = 1; i <= amount; i++) {
    const userTemp =
      refnosqlTestData.defaultUsers[
        (i - 1) % refnosqlTestData.defaultUsers.length
      ]; // Modulo to loop over dataset

    const user = `('${userTemp.username}', '${userTemp.country}')`;
    const skins = refnosqlTestData.defaultSkins
      .filter((f) => f.username == userTemp.username)
      .map((m) => `('${m.code}', '${m.name}', ${i})`);

    userArray.push(user);
    skinArray.push(skins);
  }

  db.run(
    `INSERT INTO users (username, country) VALUES ${userArray.join(",")};`
  );
  db.run(
    `INSERT INTO skins (code, skin_name, creator) VALUES ${skinArray.join(
      ","
    )};`
  );
  return Date.now() - start;
}

async function measure(f) {
  const timer = Date.now();
  const ans = await f();
  return [Date.now() - timer, ans];
}

async function testBySize(size, withref = false) {
  await reset();

  const times = {};

  //            Keanu Reeves                          Keanu Reeves               Keanu
  //      Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //      Keanu Reeves                      Keanu                   Reeves       Keanu
  //          Keanu Reeves                  Keanu                   Reeves       Keanu
  //              Keanu Reeves              Keanu                   Reeves       Keanu
  //                  Keanu Reeves          Keanu                   Reeves       Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu             Keanu Reeves       Keanu
  //      Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu Reeves Keanu Reeves
  //             Keanu Reeves                         Keanu Reeves   Reeves      Keanu Reeves Keanu Reeves

  const create_sql = insertSQL(size);
  // [x][x] Find({})
  const _f1 = await measure(async () => {
    return db.query(queries.f1);
  });
  // [x][x] Find(Filter)
  const _f2 = await measure(async () => {
    return db.query(queries.f2);
  });
  // [x][x]	Find(Filter, Projection)
  const _f3 = await measure(async () => {
    return db.query(queries.f3);
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const _f4 = await measure(async () => {
    return db.query(queries.f4);
  });
  // [x][x] Aggregate count skins of user
  const _a1 = await measure(async () => {
    return db.query(queries.a1);
  });
  // [x][x] Indexed Volltextsuche
  const _t1 = await measure(async () => {
    return db.query(queries.t1);
  });
  // [x][x]	Update One
  const _u1 = await measure(async () => {
    db.run(queries.u1);
  });
  // [x][x]	Update All
  const _u2 = await measure(async () => {
    db.run(queries.u2);
  });
  // [x][x]	Delete One
  const _d1 = await measure(async () => {
    db.run(queries.d1[0]);
    db.run(queries.d1[1]);
  });
  // [x][x]	Delete All
  const _d2 = await measure(async () => {
    db.run(queries.d2[0]);
    db.run(queries.d2[1]);
  });
  times.sql = {
    inserts: create_sql,
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
  };

  //  Keanu            Keanu              Keanu Keanu Keanu                     Keanu Reeves                          Keanu Reeves               Keanu
  //  Keanu            Keanu          Keanu Reeves Keanu Reeves           Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu
  //  Keanues          Keanu       Keanu                   Reeves     Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanueves        Keanu       Keanu                   Reeves     Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  KeanuReeves      Keanu       Keanu                   Reeves         Keanu Reeves                      Keanu                   Reeves       Keanu
  //  Keanu  Reeves    Keanu       Keanu                   Reeves             Keanu Reeves                  Keanu                   Reeves       Keanu
  //  Keanu    Reeves  Keanu       Keanu                   Reeves                 Keanu Reeves              Keanu                   Reeves       Keanu
  //  Keanu      ReevesKeanu       Keanu                   Reeves                     Keanu Reeves          Keanu                   Reeves       Keanu
  //  Keanu        ReevKeanu       Keanu                   Reeves     Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanu          ReKeanu       Keanu                   Reeves     Keanu Reeves        Keanu Reeves      Keanu             Keanu Reeves       Keanu
  //  Keanu            Keanu          Keanu Reeves Keanu Reeves           Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu Reeves Keanu Reeves
  //  Keanu            Keanu             Keanu Keanu Keanu                       Keanu Reeves                         Keanu Reeves   Reeves      Keanu Reeves Keanu Reeves

  const create_nosql = await insertNoSQL(size);
  // [x][x] Find({})
  const f1 = await measure(async () => {
    return await User.find({});
  });
  // [x][x] Find(Filter)
  const f2 = await measure(async () => {
    return await User.find({ country: "Austria" });
  });
  // [x][x]	Find(Filter, Projection)
  const f3 = await measure(async () => {
    return await User.find({ country: "Austria" }, { id: 1, username: 1 });
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const f4 = await measure(async () => {
    return await User.find({ country: "Austria" }, { id: 1, username: 1 }).sort(
      {
        _id: -1,
      }
    );
  });
  // [x][x] Aggregate count skins of user
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
  // [x][x] Indexed Volltextsuche
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
  const u1 = await measure(async () => {
    return await User.updateOne(
      { username: "Fyshi" },
      { $set: { comp_points: 100 } }
    );
  });
  // [x][x]	Update All
  const u2 = await measure(async () => {
    return await User.updateMany({}, { $set: { comp_points: 999 } });
  });
  // [x][x]	Delete One
  const d1 = await measure(async () => {
    return await User.deleteOne({ username: "Fyshi" });
  });
  // [x][x]	Delete All
  const d2 = await measure(async () => {
    return await User.deleteMany({});
  });
  times.nosql = {
    inserts: create_nosql,
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
  };
              
  // Keanu Reeves Keanu Reeves  Keanu                                     Keanu                         Keanu Reeves                          Keanu Reeves               Keanu
  // Keanu Reeves Keanu Reeves   Keanu                                   Keanu                    Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu
  // Keanu                        Keanu                                 Keanu                 Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  // Keanu                         Keanu                               Keanu                  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  // Keanu                          Keanu                             Keanu                       Keanu Reeves                      Keanu                   Reeves       Keanu
  // Keanu Reeves Keanu              Keanu            k r            Keanu      Keanu Reeves          Keanu Reeves                  Keanu                   Reeves       Keanu
  // Keanu Reeves Keanu               Keanu         Ree ves         Keanu       Reeves Keanu              Keanu Reeves              Keanu                   Reeves       Keanu
  // Keanu                             Keanu     Reeves Reeves     Keanu                                      Keanu Reeves          Keanu                   Reeves       Keanu
  // Keanu                              Keanu   Reeves   Reeves   Keanu                       Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  // Keanu                               Keanu Reeves     Reeves Keanu                        Keanu Reeves        Keanu Reeves      Keanu             Keanu Reeves       Keanu
  // Keanu Reeves Keanu Reeves             Ree ves           Ree ves                              Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu Reeves Keanu Reeves
  // Keanu Reeves Keanu Reeves               k r               k r                                       Keanu Reeves                         Keanu Reeves   Reeves      Keanu Reeves Keanu Reeves

  if (withref) {
    const create_ref_nosql = await insertRefNoSQL(size);

    // [x][x] Find({})
    const ref_f1 = await measure(async () => {
      return await RefUser.find({});
    });
    // [x][x] Find(Filter)
    const ref_f2 = await measure(async () => {
      return await RefUser.find({ country: "Austria" });
    });
    // [x][x]	Find(Filter, Projection)
    const ref_f3 = await measure(async () => {
      return await RefUser.find({ country: "Austria" }, { id: 1, username: 1 });
    });
    // [x][x]	Find(Filter, Projection, Sorting)
    const ref_f4 = await measure(async () => {
      return await RefUser.find(
        { country: "Austria" },
        { id: 1, username: 1 }
      ).sort({
        _id: -1,
      });
    });
    // [x][x] Aggregate count skins of user
    const ref_a1 = await measure(async () => {
      return await RefSkin.aggregate([
        {
          $lookup: {
            from: "refusers",
            localField: "creatorId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $match: { "user.username": "Fyshi" } },
        {
          $group: {
            _id: "$creatorId",
            username: { $first: "$user.username" },
            numOfSkins: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            username: { $arrayElemAt: ["$username", 0] },
            numOfSkins: 1,
          },
        },
      ]);
    });
    // [x][x] Indexed Volltextsuche
    const ref_t1 = await measure(async () => {
      return await RefUser.aggregate([
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
    const ref_u1 = await measure(async () => {
      return await RefUser.updateOne(
        { username: "Fyshi" },
        { $set: { comp_points: 100 } }
      );
    });
    // [x][x]	Update All
    const ref_u2 = await measure(async () => {
      return await RefUser.updateMany({}, { $set: { comp_points: 999 } });
    });
    // [x][x]	Delete One
    const ref_d1 = await measure(async () => {
      return await RefUser.deleteOne({ username: "Fyshi" });
    });
    // [x][x]	Delete All
    const ref_d2 = await measure(async () => {
      return await RefUser.deleteMany({});
    });

    times.ref_nosql = {
      inserts: create_ref_nosql,
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
    };
  }

  await reset();

  const answer = {
    size: size,
    times: {
      ...times,
    },
  };

  return {
    ...answer,
  };
}

testRouter.get("/basic", async function (req, res, next) {
  try {
    const s = parseInt(req.query.size) ?? 10;
    const size = s > 9 ? s : 10;

    const answer = await testBySize(size, true);

    await Test.create({ data: answer });

    res.json(answer);
  } catch (err) {
    console.error(`Error while testing`, err.message);
    next(err);
  }
});

testRouter.get("/advanced", async function (req, res, next) {
  try {
    const answers = {
      100: await testBySize(100),
      1_000: await testBySize(1_000),
      10_000: await testBySize(10_000),

      /* Too Much (takes ~ 5 minutes) */
      /* 100_000: await testBySize(100_000) */
    };

    await Test.create({ data: answers });

    res.json({ ...answers });
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/eternity", async function (req, res, next) {
  try {
    const answers = {
      100: await testBySize(100),
      1_000: await testBySize(1_000),
      10_000: await testBySize(10_000),
      100_000: await testBySize(100_000),
    };

    await Test.create({ data: answers });

    res.json({ ...answers });
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/", async function (req, res, next) {
  try {
    const tests = await Test.find({}).limit(20);

    res.json(tests);
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/clear", async function (req, res, next) {
  try {
    await Test.deleteMany({});

    res.json({ message: "done" });
  } catch (err) {
    console.error(`CLEARING ERROR: `, err.message);
    next(err);
  }
});

export default testRouter;
