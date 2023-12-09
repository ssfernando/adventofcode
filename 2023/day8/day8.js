const path = require("path");
const fs = require("fs");

const testInput = ["LLR", "AAA = (BBB, BBB)", "BBB = (AAA, ZZZ)", "ZZZ = (ZZZ, ZZZ)"];
const testInput2 = [
  "LR",
  "11A = (11B, XXX)",
  "11B = (XXX, 11Z)",
  "11Z = (11B, XXX)",
  "22A = (22B, XXX)",
  "22B = (22C, 22C)",
  "22C = (22Z, 22Z)",
  "22Z = (22B, 22B)",
  "XXX = (XXX, XXX)",
];

function calculateNumberOfStepsToReachEnd(input) {
  const instructions = input[0];
  const instructionsLength = instructions.length;
  let networkMap = input.slice(1).reduce(
    (partialNetworkMap, networkUnparsed) => ({
      ...partialNetworkMap,
      [networkUnparsed.slice(0, 3)]: {
        L: networkUnparsed.slice(7, 10),
        R: networkUnparsed.slice(12, 15),
      },
    }),
    {},
  );
  let currentPosition = "AAA";
  let currentStep = 0;

  while (currentPosition.indexOf("ZZZ") < 0) {
    currentPosition = networkMap[currentPosition][instructions[currentStep % instructionsLength]];
    currentStep++;
  }

  return currentStep;
}

function calculateNumberOfStepsToReachEnd2(input) {
  const instructions = input[0];
  const instructionsLength = instructions.length;
  let networkMap = input.slice(1).reduce(
    (partialNetworkMap, networkUnparsed) => ({
      ...partialNetworkMap,
      [networkUnparsed.slice(0, 3)]: {
        L: networkUnparsed.slice(7, 10),
        R: networkUnparsed.slice(12, 15),
      },
    }),
    {},
  );
  let currentPositions = Object.keys(networkMap).filter((position) => position[2] == "A");
  let stepsPerPosition = currentPositions.map((_) => 0);

  for (let i = 0; i < currentPositions.length; i++) {
    while (currentPositions[i][2] != "Z") {
      currentPositions[i] =
        networkMap[currentPositions[i]][instructions[stepsPerPosition[i] % instructionsLength]];
      stepsPerPosition[i]++;
    }
    currentStep = 0;
  }

  return lcmStepsPerPosition(stepsPerPosition);
}

function lcmStepsPerPosition(stepsPerPosition) {
  return stepsPerPosition.reduce(lcm);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function gcd(a, b) {
  return a ? gcd(b % a, a) : b;
}

const testResult1 = calculateNumberOfStepsToReachEnd(testInput);
console.assert(testResult1 == 6, "Expected: " + 7 + " but got: " + testResult1);
console.log("Test resul 1: " + testResult1);
const testResult2 = calculateNumberOfStepsToReachEnd2(testInput2);
console.assert(testResult2 == 6, "Expected: " + 7 + " but got: " + testResult2);
console.log("Test resul 2: " + testResult2);

let inputFile = fs
  .readFileSync(path.resolve(__dirname, "day8input.txt"), "utf-8")
  .split("\n")
  .filter((v) => v.length != 0);
const result1 = calculateNumberOfStepsToReachEnd(inputFile);
console.log("Result 1: " + result1);
const result2 = calculateNumberOfStepsToReachEnd2(inputFile);
console.log("Result 2: " + result2);
