import express from "express";
import User from "../services/crud/nosql/users.js";
import Map from "../services/crud/nosql/maps.js";
import Skin from "../services/crud/nosql/skins.js";

const noSQLrouter = express.Router();

noSQLrouter.get("/users", async function (req, res, next) {
  try {
    res.json(await User.find({}));
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

noSQLrouter.get("/maps", async function (req, res, next) {
  try {
    res.json(await Map.find({}));
  } catch (err) {
    console.error(`Error while getting Maps `, err.message);
    next(err);
  }
});

noSQLrouter.get("/skins", async function (req, res, next) {
  try {
    res.json(await Skin.find({}));
  } catch (err) {
    console.error(`Error while getting Skins `, err.message);
    next(err);
  }
});

export default noSQLrouter;
