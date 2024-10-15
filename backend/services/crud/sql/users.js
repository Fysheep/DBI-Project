import db from "../../sql.js";

const selectAll = "SELECT * FROM";

function getAll(params = []) {
  const data = db.query(`${selectAll} users`, [...params]);

  return {
    data,
  };
}

export default { getAll };
