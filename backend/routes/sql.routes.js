import express from "express";
import users from "../services/crud/sql/users.js";
import skins from "../services/crud/sql/skins.js";
import maps from "../services/crud/sql/maps.js";
import replays from "../services/crud/sql/replays.js";

const SQLrouter = express.Router();

SQLrouter.get("/users", function (req, res, next) {
  try {
    res.json(users.getAll());
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

SQLrouter.get("/skins", function (req, res, next) {
  try {
    res.json(skins.getAll());
  } catch (err) {
    console.error(`Error while getting Skins `, err.message);
    next(err);
  }
});

SQLrouter.get("/maps", function (req, res, next) {
  try {
    res.json(maps.getAll());
  } catch (err) {
    console.error(`Error while getting Maps `, err.message);
    next(err);
  }
});

SQLrouter.get("/replays", function (req, res, next) {
  try {
    res.json(replays.getAll());
  } catch (err) {
    console.error(`Error while getting Replays `, err.message);
    next(err);
  }
});

export default SQLrouter;
