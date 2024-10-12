import db from "../../sql.js";

const cols = [];
const listedCols =
  /* cols.map(m => `${m[0]} AS ${m[1]}`).reduce((a,b) => a + ", " + b) */ "*";
const selectAll = `SELECT ${listedCols} FROM`;

function getAll(params = []) {
  const data = db.query(`${selectAll} users`, [...params]);

  return {
    data,
  };
}

export default { getAll };
