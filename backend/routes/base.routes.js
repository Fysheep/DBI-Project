import express from "express";
import db from "../services/sql.js";
import User from "../services/crud/nosql/users.js";
import Skin from "../services/crud/nosql/skins.js";
import Map from "../services/crud/nosql/maps.js";

const baseRouter = express.Router();

baseRouter.get("/reset", function (req, res, next) {
  try {
    db.run(
      `
      DELETE FROM replays;
      DELETE FROM maps;
      DELETE FROM skins;
      DELETE FROM users;
      `
    );
    User.deleteMany({});
    Skin.deleteMany({});
    Map.deleteMany({});

    res.json({ code: 200 });
  } catch (err) {
    console.error(`Error while resetting `, err.message);
    next(err);
  }
});

baseRouter.get("/base", function (req, res, next) {
  try {
    res.json(users.getAll());
  } catch (err) {
    console.error(`Error while building base `, err.message);
    next(err);
  }
});

baseRouter.get("/test", function (req, res, next) {
  try {
    res.json(users.getAll());
  } catch (err) {
    console.error(`Error while testing`, err.message);
    next(err);
  }
});

export default baseRouter;
