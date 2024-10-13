import db from "../../sql.js";

const selectAll = `SELECT * FROM`;

function getAll() {
  const data = db.query(`${selectAll} skins;`, []);

  return {
    data,
  };
}

function findByCreator(id = 1) {
  const data = db.query(`${selectAll} skins WHERE creator is ?`, [id]);

  return {
    data,
  };
}

export default { getAll, findByCreator };
