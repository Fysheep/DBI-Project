import db from "../../sql.js";

const cols = [
  ["skins.id", "skin_id"],
  ["username", "creator_name"],
  ["skins.creator", "creator_id"],
  ["code", "skin_code"],
  ["skins.created", "created_date"],
];
const listedCols = cols.map(m => `${m[0]} AS ${m[1]}`).reduce((a,b) => a + ", " + b);
const selectAll = `SELECT ${listedCols} FROM`;
const joinUser = `INNER JOIN users u ON u.id = skins.creator`;

function getAll(params = []) {
  const data = db.query(`${selectAll} skins ${joinUser}`, [...params]);

  return {
    data,
  };
}

export default { getAll };
