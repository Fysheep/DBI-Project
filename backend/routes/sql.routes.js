import express from "express";
import users from "../services/crud/sql/users.js";
import skins from "../services/crud/sql/skins.js";

const SQLrouter = express.Router();

SQLrouter.get("/users", function (req, res, next) {
  try {
    const userList = users.getAll().data;

    userList.map((usr) => {
      usr.skins = skins.findByCreator(usr.id).data
    });

    res.json(userList);
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

export default SQLrouter;
