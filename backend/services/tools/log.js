const colors = {
  black: "30",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  magenta: "35",
  cyan: "36",
  white: "37",
};

function colorToCode(color) {
  const colorR = colors[color];
  if (!colorR) return "";
  return colorR;
}
const cs = {}

cs.log = function (...logObjects) {
  const logStrings = logObjects.map(
    (m) => `\x1b[${colorToCode(m[0])}m${m[1]}\x1b[0m`
  );
  console.log(...logStrings);
};

export default cs;
