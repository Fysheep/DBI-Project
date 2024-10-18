import express from "express";
import User from "../services/crud/nosql/users.js";

const noSQLrouter = express.Router();

noSQLrouter.get("/users/search", async function (req, res, next) {
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

noSQLrouter.get("/users", async function (req, res, next) {
  try {
    res.json(await User.find({}).sort({ comp_points: -1 }));
  } catch (err) {
    console.error(`Error in USERS: `, err.message);
    next(err);
  }
});

noSQLrouter.get("/users/delete", async function (req, res, next) {
  try {
    const id = req.query.id;

    res.json(await User.deleteOne({ _id: id }));
  } catch (err) {
    console.error(`Error in DELETE USER `, err.message);
    next(err);
  }
});

noSQLrouter.post("/users/edit", async function (req, res, next) {
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

noSQLrouter.post("/users/create", async function (req, res, next) {
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

export default noSQLrouter;
