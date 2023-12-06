const path = require("path");
const fs = require("fs");

const testInput = ["Time:      7  15   30", "Distance:  9  40  200"];

function convertInput(input) {
  const times = input[0]
    .split(/Time:[ ]+?/)[1]
    .trim()
    .split(/[ ]+/)
    .map((n) => Number(n));
  const distances = input[1]
    .split(/Distance:[ ]+?/)[1]
    .trim()
    .split(/[ ]+/)
    .map((n) => Number(n));

  return {
    times,
    distances,
  };
}

function convertInput2(input) {
  const time = Number(
    input[0]
      .split(/Time:[ ]+?/)[1]
      .trim()
      .replace(/[ ]*/g, ""),
  );
  const distance = Number(
    input[1]
      .split(/Distance:[ ]+?/)[1]
      .trim()
      .replace(/[ ]*/g, ""),
  );

  return {
    times: [time],
    distances: [distance],
  };
}

function getErrorMargin(inputObject) {
  let raceBeatingWays = inputObject.times.reduce(
    (pv, nv, ci) => ({
      ...pv,
      [ci]: 0,
    }),
    {},
  );
  for (let i = 0; i < inputObject.times.length; i++) {
    let time = inputObject.times[i];
    let distanceToBeat = inputObject.distances[i];
    let start = 1;
    let end = inputObject.times[i] - 1;

    while (start < end) {
      if ((time - start) * start > distanceToBeat) {
        raceBeatingWays[i]++;
      }
      if ((time - end) * end > distanceToBeat) {
        raceBeatingWays[i]++;
      }
      start++;
      end--;

      if (start == end) {
        if ((time - end) * end > distanceToBeat) {
          raceBeatingWays[i]++;
        }
      }
    }
  }

  return Object.values(raceBeatingWays).reduce((pv, nv) => pv * nv);
}

const testResult1 = getErrorMargin(convertInput(testInput));
console.assert(
  testResult1 == 288,
  "Expected: " + 288 + " but got: " + testResult1,
);
console.log("Test result 1: " + testResult1);

const testResult2 = getErrorMargin(convertInput2(testInput));
console.assert(
  testResult2 == 71503,
  "Expected: " + 71503 + " but got: " + testResult2,
);
console.log("Test result 2: " + testResult2);

const inputFile = fs
  .readFileSync(path.resolve(__dirname, "day6input.txt"), "utf-8")
  .split("\n");
const result1 = getErrorMargin(convertInput(inputFile));
console.log("Result 1: " + result1);
const result2 = getErrorMargin(convertInput2(inputFile));
console.log("Result 2: " + result2);
