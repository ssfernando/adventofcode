const path = require("path");
const fs = require("fs");

const inputTest = ["0 3 6 9 12 15", "1 3 6 10 15 21", "10 13 16 21 30 45"];

function parseInput(input) {
  return input.map((v) => v.split(" ").map((v) => Number(v)));
}

function calculateSumOfExtrapolatedValues(input) {
  let sequences = input.map((v) => [v]);
  for (let i = 0; i < input.length; i++) {
    let sequenceIndex = 0;
    while (sequences[i][sequenceIndex].some((v) => v != 0)) {
      for (let j = 0; j < sequences[i][sequenceIndex].length - 1; j++) {
        if (!sequences[i][sequenceIndex + 1]) sequences[i][sequenceIndex + 1] = [];

        sequences[i][sequenceIndex + 1].push(
          sequences[i][sequenceIndex][j + 1] - sequences[i][sequenceIndex][j],
        );
      }
      sequenceIndex++;
    }

    sequences[i][sequences[i].length - 1].push(0);

    for (let j = sequences[i].length - 1; j > 0; j--) {
      sequences[i][j - 1].push(
        sequences[i][j][sequences[i][j].length - 1] + sequences[i][j - 1][sequences[i][j - 1].length - 1],
      );
    }
  }

  return sequences.map((sequence) => sequence[0][sequence[0].length - 1]).reduce((a, b) => a + b);
}

function calculateSumOfExtrapolatedValues2(input) {
  let sequences = input.map((v) => [v]);
  for (let i = 0; i < input.length; i++) {
    let sequenceIndex = 0;
    while (sequences[i][sequenceIndex].some((v) => v != 0)) {
      for (let j = 0; j < sequences[i][sequenceIndex].length - 1; j++) {
        if (!sequences[i][sequenceIndex + 1]) sequences[i][sequenceIndex + 1] = [];

        sequences[i][sequenceIndex + 1].push(
          sequences[i][sequenceIndex][j + 1] - sequences[i][sequenceIndex][j],
        );
      }
      sequenceIndex++;
    }

    sequences[i][sequences[i].length - 1] = [0, ...sequences[i][sequences[i].length - 1]];

    for (let j = sequences[i].length - 1; j > 0; j--) {
      sequences[i][j - 1] = [sequences[i][j - 1][0] - sequences[i][j][0], ...sequences[i][j - 1]];
    }
  }

  return sequences.map((sequence) => sequence[0][0]).reduce((a, b) => a + b);
}

const testResult1 = calculateSumOfExtrapolatedValues(parseInput(inputTest));
console.assert(testResult1 == 114, "Expected: " + 114 + " but got: " + testResult1);
console.log("Test result 1: " + testResult1);
const testResult2 = calculateSumOfExtrapolatedValues2(parseInput(inputTest));
console.assert(testResult2 == 2, "Expected: " + 2 + " but got: " + testResult2);
console.log("Test result 1: " + testResult2);

let inputFile = fs
  .readFileSync(path.resolve(__dirname, "day9input.txt"), "utf-8")
  .split("\n")
  .filter((v) => v.length != 0);
const result1 = calculateSumOfExtrapolatedValues(parseInput(inputFile));
console.log("Result 1: " + result1);
const result2 = calculateSumOfExtrapolatedValues2(parseInput(inputFile));
console.log("Result 2: " + result2);
