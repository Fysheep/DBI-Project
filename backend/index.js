import appRouter from "./routes/crud.routes.js";
import testRouter from "./routes/test.routes.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connect as connect_mongo } from "./services/system_controller/mongo.js";
import { connect as connect_mysql } from "./services/system_controller/mysql.js";
import { connect as connect_sqlite } from "./services/system_controller/sqlite.js";
import cs from "./services/tools/log.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8001;


console.clear();
await Promise.all([connect_sqlite(), connect_mysql(), connect_mongo()]);

app.use("/", appRouter);
app.use("/test/", testRouter);

app.listen(port, () => {
  cs.log(
    ["magenta", `(EXPRESS.JS)`],
    ["white", ` => `],
    ["cyan", `http://localhost:${port}`]
  );
});

export default app;
