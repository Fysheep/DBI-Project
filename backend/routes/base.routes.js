import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import testData from "../services/crud/nosql/userData.js";
import { reset } from "../services/tools/data_manip.js";
import fs from "node:fs";

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

    await User.insertMany(testData.defaultUsers);

    res.json({ message: "done" });
  } catch (err) {
    console.error(`Error while building base `, err.message);
    next(err);
  }
});

export default baseRouter;
