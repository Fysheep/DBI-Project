import noSQLrouter from "./routes/crud.routes.js";
import baseRouter from "./routes/base.routes.js";
import testRouter from "./routes/test.routes.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connect } from "./services/nosql.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8001;

connect();

app.get("/", (req, res) => {
  res.json({ message: "hello :)" });
});

app.use("/nosql/", noSQLrouter);
app.use("/", baseRouter);
app.use("/test/", testRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

export default app;
