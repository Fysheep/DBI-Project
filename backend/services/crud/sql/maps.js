import db from "../../sql.js";

const cols = [
  ["maps.id", "map_id"],
  ["username", "creator_name"],
  ["maps.creator", "creator_id"],
  ["title", "map_title"],
  ["author_medal", "author_time"],
  ["gold_medal", "gold_time"],
  ["silver_medal", "silver_time"],
  ["bronze_medal", "bronze_time"],
  ["maps.created", "created_date"],
];
const listedCols = cols
  .map((m) => `${m[0]} AS ${m[1]}`)
  .reduce((a, b) => a + ", " + b);
const selectAll = `SELECT ${listedCols} FROM`;
const joinUser = `INNER JOIN users u ON u.id = maps.creator`;

function getAll(params = []) {
  const data = db.query(`${selectAll} maps ${joinUser}`, [...params]);

  return {
    data,
  };
}

export default { getAll };
