import fs from "node:fs";

import User from "../mongo_classes/normal/users.js";
import RefSkin from "../mongo_classes/referencing/skins.js";
import RefUser from "../mongo_classes/referencing/users.js";

import nosqlTestData from "../mongo_classes/normal/userData.js";
import refnosqlTestData from "../mongo_classes/referencing/userData.js";
import db_sqlite from "../system_controller/sqlite.js";
import db_mysql from "../system_controller/mysql.js";

async function delete_NoSQL() {
  await User.deleteMany({});
}

async function reset() {
  fs.readFile("./models/sql/sqlite/createDB.sql", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    db_sqlite.run(data);
  });
  fs.readFile("./models/sql/mysql/createDB.sql", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    data.split("--##SPLITTER##--").forEach((f) => {
      db_mysql.run(f);
    });
  });

  await delete_NoSQL();
}

/**
 * Puts [Amount] Users into the MongoDB
 * */
async function insertMongo(amount, batchSize = 1000) {
  const usersToInsert = [];
  for (let i = 0; i < amount; i++) {
    const user =
      nosqlTestData.defaultUsers[i % nosqlTestData.defaultUsers.length];
    usersToInsert.push(user);
  }

  const insertUsersInBatches = async (users, batchSize) => {
    const userBatches = [];
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      userBatches.push(
        User.insertMany(batch, {
          validateBeforeSave: false,
          ordered: false,
        })
      );
    }
    await Promise.all(userBatches);
  };

  await insertUsersInBatches(usersToInsert, batchSize);
}

/**
 * Puts [Amount] referencing Users into the MongoDB
 * */
async function insertMongo_r(amount, batchSize = 1000) {
  const usersToInsert = [];
  for (let i = 0; i < amount; i++) {
    const userTemplate =
      refnosqlTestData.defaultUsers[i % refnosqlTestData.defaultUsers.length];
    usersToInsert.push({ ...userTemplate });
  }

  const insertUsersInBatches = async (users, batchSize) => {
    const userBatches = [];
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      userBatches.push(RefUser.insertMany(batch, { ordered: false }));
    }
    const insertedUsersArray = await Promise.all(userBatches);
    return insertedUsersArray.flat();
  };

  const insertedUsers = await insertUsersInBatches(usersToInsert, batchSize);

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

  const insertSkinsInBatches = async (skins, batchSize) => {
    const skinBatches = [];
    for (let i = 0; i < skins.length; i += batchSize) {
      const batch = skins.slice(i, i + batchSize);
      skinBatches.push(RefSkin.insertMany(batch, { ordered: false }));
    }
  };

  if (skinsToInsert.length > 0) {
    await insertSkinsInBatches(skinsToInsert, batchSize);
  }
}

/**
 * Tries to put [Amount] illegal Users into the MongoDB
 * */
async function insertMongo_i(amount, batchSize = 1000) {
  const usersToInsert = [];
  for (let i = 0; i < amount; i++) {
    const user =
      nosqlTestData.defaultUsers[i % nosqlTestData.defaultUsers.length];
    delete user.country;
    usersToInsert.push(user);
  }

  const insertUsersInBatches = async (users, batchSize) => {
    const userBatches = [];
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      userBatches.push(
        User.insertMany(batch, {
          validateBeforeSave: false,
          ordered: false,
        })
      );
    }
    await Promise.all(userBatches);
  };

  await insertUsersInBatches(usersToInsert, batchSize);
}

/**
 * Puts [Amount] Users into the SQLite Database
 * */
function insertSQLite(amount) {
  const userArray = [];
  const skinArray = [];
  for (let i = 1; i <= amount; i++) {
    const userTemp =
      refnosqlTestData.defaultUsers[
        (i - 1) % refnosqlTestData.defaultUsers.length
      ];

    const user = `('${userTemp.username}', '${userTemp.country}')`;
    const skins = refnosqlTestData.defaultSkins
      .filter((f) => f.username == userTemp.username)
      .map((m) => `('${m.code}', '${m.name}', ${i})`);

    userArray.push(user);
    skinArray.push(skins);
  }

  db_sqlite.run(
    `INSERT INTO users (username, country) VALUES ${userArray.join(",")};`
  );
  db_sqlite.run(
    `INSERT INTO skins (code, skin_name, creator) VALUES ${skinArray.join(
      ","
    )};`
  );
}

/**
 * Puts [Amount] Users into the SQLite Database
 * */
function insertMySQL(amount) {
  const userArray = [];
  const skinArray = [];
  for (let i = 1; i <= amount; i++) {
    const userTemp =
      refnosqlTestData.defaultUsers[
        (i - 1) % refnosqlTestData.defaultUsers.length
      ];

    const user = `('${userTemp.username}', '${userTemp.country}')`;
    const skins = refnosqlTestData.defaultSkins
      .filter((f) => f.username == userTemp.username)
      .map((m) => `('${m.code}', '${m.name}', ${i})`);

    userArray.push(user);
    skinArray.push(skins);
  }

  db_mysql.run(
    `INSERT INTO users (username, country) VALUES ${userArray.join(",")};`
  );
  db_mysql.run(
    `INSERT INTO skins (code, skin_name, creator) VALUES ${skinArray.join(
      ","
    )};`
  );
}

export { reset, insertSQLite, insertMySQL, insertMongo, insertMongo_r, insertMongo_i };
