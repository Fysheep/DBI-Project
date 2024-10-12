import express from "express";
import users from "../services/crud/nosql/users.js";

const noSQLrouter = express.Router();

noSQLrouter.get("/users", async function (req, res, next) {
  try {
    res.json(await users.find({}));
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

export default noSQLrouter;
