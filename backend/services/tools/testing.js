import db_sqlite from "../system_controller/sqlite.js";
import User from "../mongo_classes/normal/users.js";
import RefSkin from "../mongo_classes/referencing/skins.js";
import RefUser from "../mongo_classes/referencing/users.js";

import { measure, measure_ } from "./time.js";
import {
  reset,
  insertSQLite,
  insertMySQL,
  insertMongo,
  insertMongo_r,
  insertMongo_i,
} from "./data_manip.js";
import db_mysql from "../system_controller/mysql.js";

const queries = {
  // [x]  Find({})
  f1: `SELECT * FROM users LIMIT 100;`,
  // [x]  Find(Filter)
  f2: `SELECT * FROM users WHERE country like 'Austria' LIMIT 100;`,
  // [x]  Find(Filter, Projection)
  f3: `SELECT id,username FROM users WHERE country like 'Austria' LIMIT 100;`,
  // [x]  Find(Filter, Projection, Sorting)
  f4: `SELECT id,username FROM users WHERE country = 'Austria' ORDER BY id DESC LIMIT 100;`,
  // [x]  Aggregation
  a1: ` SELECT users.username, COUNT(skins.id) AS skin_amount
        FROM users
        LEFT JOIN skins ON users.id = skins.creator
        WHERE users.username = 'Fyshi'
        GROUP BY users.username
        LIMIT 100;`,
  // [x]  Index SQL Attempt
  t1: `SELECT * FROM users WHERE username LIKE '%Austria%' OR country LIKE '%Austria%' OR comp_points LIKE '%Austria%' LIMIT 100;`,
  // [x]  Update One
  u1: `UPDATE users SET comp_points = 100 WHERE username like 'Fyshi'`,
  // [x]  Update All
  u2: `UPDATE users SET comp_points = 999`,
  // [x]  Delete One
  d1: [
    `DELETE FROM skins WHERE creator = 1;`,
    `DELETE FROM users WHERE id = 1;`,
  ],
  // [x]  Delete All
  d2: [`DELETE FROM skins`, `DELETE FROM users`],
};

async function measureMySQL(size) {
  //  Keanu              Keanu    Reeves              Reeves            Keanu Reeves                          Keanu Reeves               Keanu
  //  Keanues          ReKeanu      Reeves          Reeves        Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu
  //  Keanueves      ReevKeanu        Reeves      Reeves      Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  KeanuReeves  ReevesKeanu          Reeves  Reeves        Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanu  ReeveReeve  Keanu            ReeveReeve              Keanu Reeves                      Keanu                   Reeves       Keanu
  //  Keanu    Reeves    Keanu              Reeves                    Keanu Reeves                  Keanu                   Reeves       Keanu
  //  Keanu              Keanu              Reeves                        Keanu Reeves              Keanu                   Reeves       Keanu
  //  Keanu              Keanu              Reeves                            Keanu Reeves          Keanu                   Reeves       Keanu
  //  Keanu              Keanu              Reeves            Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu
  //  Keanu              Keanu              Reeves            Keanu Reeves        Keanu Reeves      Keanu             Keanu Reeves       Keanu
  //  Keanu              Keanu              Reeves                Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu Reeves Keanu Reeves
  //  Keanu              Keanu              Reeves                       Keanu Reeves                         Keanu Reeves   Reeves      Keanu Reeves Keanu Reeves

  const inserts = measure_(() => {
    insertMySQL(size);
    return;
  });
  // [x][x] Find({})
  const find_all = measure_(() => {
    return db_mysql.query(queries.f1);
  });
  // [x][x] Find(Filter)
  const find_filter = measure_(() => {
    return db_mysql.query(queries.f2);
  });
  // [x][x]	Find(Filter, Projection)
  const find_filter_projection = measure_(() => {
    return db_mysql.query(queries.f3);
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const find_filter_projection_sort = measure_(() => {
    return db_mysql.query(queries.f4);
  });
  // [x][x] Aggregate count skins of user
  const aggregate = measure_(() => {
    return db_mysql.query(queries.a1);
  });
  // [x][x] Indexed Volltextsuche
  const text_search = measure_(() => {
    return db_mysql.query(queries.t1);
  });
  // [x][x]	Update One
  const update_one = measure_(() => {
    db_mysql.run(queries.u1);
  });
  // [x][x]	Update All
  const update_all = measure_(() => {
    db_mysql.run(queries.u2);
  });
  // [x][x]	Delete One
  const delete_one = measure_(() => {
    db_mysql.run(queries.d1[0]);
    db_mysql.run(queries.d1[1]);
  });
  // [x][x]	Delete All
  const delete_all = measure_(() => {
    db_mysql.run(queries.d2[0]);
    db_mysql.run(queries.d2[1]);
  });
  return {
    inserts: inserts[0],
    find_all: find_all[0],
    find_filter: find_filter[0],
    find_filter_projection: find_filter_projection[0],
    find_filter_projection_sort: find_filter_projection_sort[0],
    aggregate: aggregate[0],
    text_search: text_search[0],
    update_one: update_one[0],
    update_all: update_all[0],
    delete_one: delete_one[0],
    delete_all: delete_all[0],
  };
}

async function measureSQLite(size) {
  //            Keanu Reeves                          Keanu Reeves               Keanu                        Keanu    Reeves Keanu Reeves Keanu    Keanu Reeves Keanu Reeves
  //      Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu                        Keanu    Keanu Reeves Keanu Reeves    Keanu Reeves Keanu Reeves
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu
  //      Keanu Reeves                      Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu
  //          Keanu Reeves                  Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu Reeves Keanu
  //              Keanu Reeves              Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu Reeves Keanu
  //                  Keanu Reeves          Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu                   Reeves       Keanu                        Keanu              Keanu              Keanu
  //  Keanu Reeves        Keanu Reeves      Keanu             Keanu Reeves       Keanu                        Keanu              Keanu              Keanu
  //      Keanu Reeves Keanu Reeves            Keanu Reeves Keanu Reeves         Keanu Reeves Keanu Reeves    Keanu              Keanu              Keanu Reeves Keanu Reeves
  //             Keanu Reeves                         Keanu Reeves   Reeves      Keanu Reeves Keanu Reeves    Keanu              Keanu              Keanu Reeves Keanu Reeves

  const create_sql = await measure(async () => {
    insertSQLite(size);
    return;
  });
  // [x][x] Find({})
  const _f1 = await measure(async () => {
    return db_sqlite.query(queries.f1);
  });
  // [x][x] Find(Filter)
  const _f2 = await measure(async () => {
    return db_sqlite.query(queries.f2);
  });
  // [x][x]	Find(Filter, Projection)
  const _f3 = await measure(async () => {
    return db_sqlite.query(queries.f3);
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const _f4 = await measure(async () => {
    return db_sqlite.query(queries.f4);
  });
  // [x][x] Aggregate count skins of user
  const _a1 = await measure(async () => {
    return db_sqlite.query(queries.a1);
  });
  // [x][x] Indexed Volltextsuche
  const _t1 = await measure(async () => {
    return db_sqlite.query(queries.t1);
  });
  // [x][x]	Update One
  const _u1 = await measure(async () => {
    db_sqlite.run(queries.u1);
  });
  // [x][x]	Update All
  const _u2 = await measure(async () => {
    db_sqlite.run(queries.u2);
  });
  // [x][x]	Delete One
  const _d1 = await measure(async () => {
    db_sqlite.run(queries.d1[0]);
    db_sqlite.run(queries.d1[1]);
  });
  // [x][x]	Delete All
  const _d2 = await measure(async () => {
    db_sqlite.run(queries.d2[0]);
    db_sqlite.run(queries.d2[1]);
  });
  return {
    inserts: create_sql[0],
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
}

async function measureMongo(size) {
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

  const create_nosql = await measure(async () => {
    await insertMongo(size);
    return;
  });
  // [x][x] Find({})
  const f1 = await measure(async () => {
    return await User.find({}).limit(100);
  });
  // [x][x] Find(Filter)
  const f2 = await measure(async () => {
    return await User.find({ country: "Austria" }).limit(100);
  });
  // [x][x]	Find(Filter, Projection)
  const f3 = await measure(async () => {
    return await User.find(
      { country: "Austria" },
      { id: 1, username: 1 }
    ).limit(100);
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const f4 = await measure(async () => {
    return await User.find({ country: "Austria" }, { id: 1, username: 1 })
      .sort({
        _id: -1,
      })
      .limit(100);
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
    ]).limit(100);
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
    ]).limit(100);
  });
  // [x][x]	Update One
  const u1 = await measure(async () => {
    await User.updateOne({ username: "Fyshi" }, { $set: { comp_points: 100 } });
    return;
  });
  // [x][x]	Update All
  const u2 = await measure(async () => {
    await User.updateMany(
      {},
      { $set: { comp_points: 999 } },
      { bypassDocumentValidation: true }
    );
    return;
  });
  // [x][x]	Delete One
  const d1 = await measure(async () => {
    await User.deleteOne({ username: "Fyshi" });
    return;
  });
  // [x][x]	Delete All
  const d2 = await measure(async () => {
    await User.deleteMany({});
    return;
  });

  return {
    inserts: create_nosql[0],
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
}

async function measureMongo_r(size) {
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

  const create_ref_nosql = await measure(async () => {
    await insertMongo_r(size);
    return;
  });

  // [x][x] Find({})
  const ref_f1 = await measure(async () => {
    return await RefUser.find({}).limit(100);
  });
  // [x][x] Find(Filter)
  const ref_f2 = await measure(async () => {
    return await RefUser.find({ country: "Austria" }).limit(100);
  });
  // [x][x]	Find(Filter, Projection)
  const ref_f3 = await measure(async () => {
    return await RefUser.find(
      { country: "Austria" },
      { id: 1, username: 1 }
    ).limit(100);
  });
  // [x][x]	Find(Filter, Projection, Sorting)
  const ref_f4 = await measure(async () => {
    return await RefUser.find({ country: "Austria" }, { id: 1, username: 1 })
      .sort({
        _id: -1,
      })
      .limit(100);
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
    ]).limit(100);
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
    ]).limit(100);
  });
  // [x][x]	Update One
  const ref_u1 = await measure(async () => {
    await RefUser.updateOne(
      { username: "Fyshi" },
      { $set: { comp_points: 100 } }
    );
    return;
  });
  // [x][x]	Update All
  const ref_u2 = await measure(async () => {
    await RefUser.updateMany(
      {},
      { $set: { comp_points: 999 } },
      { bypassDocumentValidation: true }
    );
    return;
  });
  // [x][x]	Delete One
  const ref_d1 = await measure(async () => {
    await RefUser.deleteOne({ username: "Fyshi" });
    return;
  });
  // [x][x]	Delete All
  const ref_d2 = await measure(async () => {
    await RefSkin.deleteMany({});
    await RefUser.deleteMany({});
    return;
  });

  return {
    inserts: create_ref_nosql[0],
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

async function measureMongo_i(size) {
  const create_illegal_nosql = await measure(async () => {
    return await insertMongo_i(size);
  });

  return { inserts: create_illegal_nosql[0] };
}

async function testBySize(size, with_ref = false, with_illegal = false) {
  await reset();

  const times = {};

  times.MySQL = await measureMySQL(size);
  console.log(`%c(MYSQL) Tests Finished`, "color:green");
  times.SQLite = await measureSQLite(size);
  console.log(`%c(SQLITE) Tests Finished`, "color:green");
  times.MongoDB = await measureMongo(size);
  console.log(`%c(NoSQL) Tests Finished`, "color:green");
  if (with_ref) {
    times.MongoDB_r = await measureMongo_r(size);
    console.log(`%c(Referencing NoSQL) Tests Finished`, "color:green");
  }
  if (with_illegal) {
    times.MongoDB_i = await measureMongo_i(size);
    console.log(`%c(Illegal Schema) Tests Finished`, "color:green");
  }

  await reset();

  return {
    size: size,
    times: {
      ...times,
    },
  };
}

export { testBySize };
