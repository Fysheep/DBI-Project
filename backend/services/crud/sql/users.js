import db from "../../sql.js";

const selectAll = "SELECT * FROM";

function getAll(params = []) {
  const data = db.query(`${selectAll} users`, [...params]);

  return {
    data,
  };
}

function findByUsername(username = "") {
  const data = db.query(`${selectAll} users WHERE username is ?`, [username]);

  return {
    data,
  };
}

function findByCountry(country = "") {
  const data = db.query(`${selectAll} users WHERE country is ?`, [country]);

  return {
    data,
  };
}

function deleteById(id) {
  if (isNaN(id)) return;

  const userPresent = db.query(`${selectAll} users WHERE id is ?`, [id]);
  if (userPresent.length == 0) return { message: "no User found" };

  const data = db.query(`DELETE FROM users WHERE id is ?`, [id]);

  return {
    data,
  };
}

export default { getAll, findByUsername, findByCountry, deleteById };
