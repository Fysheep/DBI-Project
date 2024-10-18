import express from "express";

import Test from "../services/mongo_classes/normal/tests.js";

import { testBySize } from "../services/tools/testing.js";

const testRouter = express.Router();

testRouter.get("/basic", async function (req, res, next) {
  try {
    const s = parseInt(req.query.size) ?? 10;
    const size = s > 9 ? s : 10;

    const answer = {};
    answer[size] = await testBySize(size, true, true);

    await Test.create({ data: answer });

    res.json(answer);
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/advanced", async function (req, res, next) {
  try {
    const answers = {
      100: await testBySize(100),
      1_000: await testBySize(1_000),
      10_000: await testBySize(10_000),

      /* Too Much (takes ~ 5 minutes) */
      /* 100_000: await testBySize(100_000) */
    };

    await Test.create({ data: answers });

    res.json({ ...answers });
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/eternity", async function (req, res, next) {
  try {
    const answers = {
      100: await testBySize(100),
      1_000: await testBySize(1_000),
      10_000: await testBySize(10_000),
      100_000: await testBySize(100_000),
    };

    await Test.create({ data: answers });

    res.json({ ...answers });
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/", async function (req, res, next) {
  try {
    const tests = await Test.find({}, { data: 1, createdAt: 1, _id: 0 }).limit(
      20
    );

    res.json(tests);
  } catch (err) {
    console.error(`TESTING ERROR: `, err.message);
    next(err);
  }
});

testRouter.get("/clear", async function (req, res, next) {
  try {
    await Test.deleteMany({});

    res.json({ message: "done" });
  } catch (err) {
    console.error(`CLEARING ERROR: `, err.message);
    next(err);
  }
});

export default testRouter;
