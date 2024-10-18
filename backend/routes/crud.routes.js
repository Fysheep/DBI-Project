import express from "express";
import db from "../services/system_controller/sqlite.js";
import User from "../services/mongo_classes/normal/users.js";
import testData from "../services/mongo_classes/normal/userData.js";
import { reset } from "../services/tools/data_manip.js";
import fs from "node:fs";

const appRouter = express.Router();

appRouter.get("/reset", async function (req, res, next) {
  try {
    //reset
    await reset();
    res.json({ message: "done" });
  } catch (err) {
    console.error(`Error while resetting `, err.message);
    next(err);
  }
});

appRouter.get("/base", async function (req, res, next) {
  try {
    //reset
    await reset();
    //insert base SQL
    fs.readFile("./models/sql/fillDB.sql", "utf8", (err, data) => {
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

appRouter.get("/users/search", async function (req, res, next) {
  try {
    const term = req.query.s;
    if (!term || term.trim() == "") {
      res.json(await User.find({}).sort({ comp_points: -1 }).limit(50));
      return;
    }

    const users = await User.aggregate([
      {
        $search: {
          index: "volltextsuche",
          text: {
            query: term,
            path: {
              wildcard: "*",
            },
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $sort: {
          comp_points: -1,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    console.error(`Error in USER SEARCH: `, err.message);
    next(err);
  }
});

appRouter.get("/users", async function (req, res, next) {
  try {
    res.json(await User.find({}).sort({ comp_points: -1 }));
  } catch (err) {
    console.error(`Error in USERS: `, err.message);
    next(err);
  }
});

appRouter.get("/users/delete", async function (req, res, next) {
  try {
    const id = req.query.id;

    res.json(await User.deleteOne({ _id: id }));
  } catch (err) {
    console.error(`Error in DELETE USER `, err.message);
    next(err);
  }
});

appRouter.post("/users/edit", async function (req, res, next) {
  try {
    const user = req.body;
    const mappedUser = {
      username: user.username,
      country: user.country,
      comp_points: user.comp_points,
      skins: user.skins,
    };

    res.json(await User.updateOne({ _id: user._id }, { $set: mappedUser }));
  } catch (err) {
    console.error(`Error in DELETE USER `, err.message);
    next(err);
  }
});

appRouter.post("/users/create", async function (req, res, next) {
  try {
    const user = req.body;
    const mappedUser = {
      username: user.username,
      country: user.country,
      comp_points: user.comp_points,
      skins: user.skins,
    };

    res.json(await User.create(mappedUser));
  } catch (err) {
    console.error(`Error in DELETE USER `, err.message);
    next(err);
  }
});

export default appRouter;
