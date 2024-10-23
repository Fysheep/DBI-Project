async function measure(f) {
  const timer = process.hrtime.bigint();
  const ans = await f();
  return parseInt(process.hrtime.bigint() - timer) / 1000;
}

function measure_(f) {
  const timer = process.hrtime.bigint();
  const ans = f();
  return parseInt(process.hrtime.bigint() - timer) / 1000;
}

function toClean(num) {
  return Math.floor(num / 100) / 10;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { measure, measure_, toClean, sleep };
