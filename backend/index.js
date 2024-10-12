import SQLrouter from "./routes/sql.routes.js";
import noSQLrouter from "./routes/nosql.routes.js";
import baseRouter from "./routes/base.routes.js"

import express from "express";
import { connect } from "./services/nosql.js";

const app = express();
const port = 8001;

connect();

app.get("/", (req, res) => {
  res.json({ message: "hello :)" });
});

app.use("/sql/", SQLrouter);
app.use("/nosql/", noSQLrouter);
app.use("/", baseRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

export default app;
