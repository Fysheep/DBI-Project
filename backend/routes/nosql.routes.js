import express from "express";
import User from "../services/crud/nosql/users.js";

const noSQLrouter = express.Router();

noSQLrouter.get("/users", async function (req, res, next) {
  try {
    res.json(await User.find({}));
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

export default noSQLrouter;
