import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import testData from "../services/crud/nosql/userData.js";
import fs from "node:fs";

const baseRouter = express.Router();

async function delete_NoSQL() {
  await User.deleteMany({});
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
    await User.insertMany(testData.defaultUsers);

    res.json({ message: "done" });
  } catch (err) {
    console.error(`Error while building base `, err.message);
    next(err);
  }
});

export default baseRouter;
