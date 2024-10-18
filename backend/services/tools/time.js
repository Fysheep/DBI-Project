async function measure(f) {
  const timer = process.hrtime.bigint();
  const ans = await f();
  return [parseInt(process.hrtime.bigint() - timer) / 1000, ans];
}

function measure_(f) {
  const timer = process.hrtime.bigint();
  const ans = f();
  return [parseInt(process.hrtime.bigint() - timer) / 1000, ans];
}

export { measure, measure_ };
