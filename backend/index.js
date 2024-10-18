import appRouter from "./routes/crud.routes.js";
import testRouter from "./routes/test.routes.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { connect as connect_mongo } from "./services/system_controller/mongo.js";
import { connect as connect_mysql } from "./services/system_controller/mysql.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8001;

await connect_mysql();
await connect_mongo();

app.use("/", appRouter);
app.use("/test/", testRouter);

app.listen(port, () => {
  console.log(`(EXPRESS.JS) => Listening at http://localhost:${port}`);
});

export default app;
