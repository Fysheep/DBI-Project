import db from "../../sql.js";

const cols = [
  ["replays.id", "replay_id"],
  ["users.username", "driver_name"],
  ["replays.driver", "driver_id"],
  ["replays.record", "driven_time"],
  ["maps.title", "map_name"],
  ["replays.map", "map_id"],
  ["skins.code", "skin_code"],
  ["replays.skin", "skin_id"],
  ["replays.created", "created_date"],
];

const listedCols = cols
  .map((m) => `${m[0]} AS ${m[1]}`)
  .reduce((a, b) => a + ", " + b);
const selectAll = `SELECT ${listedCols} FROM`;
const joinUser = `INNER JOIN users ON users.id = replays.driver`;
const joinMaps = `INNER JOIN maps ON maps.id = replays.map`;
const joinSkins = `INNER JOIN skins ON skins.id = replays.skin`;

function getAll(params = []) {
  const data = db.query(
    `${selectAll} replays ${joinUser} ${joinMaps} ${joinSkins}`,
    [...params]
  );

  return {
    data,
  };
}

export default { getAll };
