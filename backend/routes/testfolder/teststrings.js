// [x]  Find({})
const f1 = `SELECT * FROM users LIMIT 100;`;

// [x]  Find(Filter)
const f2 = `SELECT * FROM users WHERE country like 'Austria' LIMIT 100;`;

// [x]	Find(Filter, Projection)
const f3 = `SELECT 'id','username' FROM users WHERE country like 'Austria' LIMIT 100;`;

// [x]	Find(Filter, Projection, Sorting)
const f4 = `SELECT 'id','username' FROM users WHERE country is 'Austria' ORDER BY id DESC LIMIT 100;`;

// [ ]	Aggregation
const a1 = `SELECT users.username, COUNT(skins.id) AS skin_amount
FROM users
LEFT JOIN skins ON users.id = skins.creator
WHERE users.username = 'Fyshi'
GROUP BY users.username
LIMIT 100;
`;

const t1 = `SELECT * FROM users WHERE username LIKE '%Austria%' OR country LIKE '%Austria%' OR comp_points LIKE '%Austria%' LIMIT 100;`;

// [x]	Update One
const u1 = `UPDATE users SET comp_points = 100 WHERE username like 'Fyshi'`;

// [x]	Update All
const u2 = `UPDATE users SET comp_points = 999`;

// [x]	Delete One
const d1 = [
  `DELETE FROM skins WHERE creator is 1`,
  `DELETE FROM users WHERE id is 1`,
];

// [x]	Delete All
const d2 = [`DELETE FROM skins`, `DELETE FROM users`];

export default { f1, f2, f3, f4, a1, t1, u1, u2, d1, d2 };
