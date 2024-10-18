import fs from "node:fs";

import db from "../sql.js";
import User from "../crud/nosql/users.js";
import RefSkin from "../crud/ref_nosql/skins.js";
import RefUser from "../crud/ref_nosql/users.js";

import nosqlTestData from "../crud/nosql/userData.js";
import refnosqlTestData from "../crud/ref_nosql/userData.js";

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
async function insertNoSQL(amount, batchSize = 1000) {
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
 * Puts [Amount] of Users into the MongoDB
 * */
async function insert_illegalNoSQL(amount, batchSize = 1000) {
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
 * Puts [Amount] of Users into the Referencing MongoDB
 * */
async function insertRefNoSQL(amount, batchSize = 1000) {
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
 * Puts [Amount] of Users into the SQLite Database
 * */
function insertSQL(amount) {
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
}

export { reset, insertSQL, insertNoSQL, insertRefNoSQL, insert_illegalNoSQL };
