const path = require("path");
const fs = require("fs");

let testInput1 = [
  "...#......",
  ".......#..",
  "#.........",
  "..........",
  "......#...",
  ".#........",
  ".........#",
  "..........",
  ".......#..",
  "#...#.....",
];

function calculateShortestDistanceBetweenStarts(input, expandMultiplier) {
  const inputSpaceExpandedCoord = expandSpace(input);

  let stars = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] == "#") {
        stars.push([i, j]);
      }
    }
  }

  let shortestDistances = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      shortestDistances.push(
        accountForExpansion(stars[i][0], stars[j][0], inputSpaceExpandedCoord[0], expandMultiplier) +
          accountForExpansion(stars[i][1], stars[j][1], inputSpaceExpandedCoord[1], expandMultiplier),
      );
    }
  }

  return shortestDistances.reduce((a, b) => a + b);
}

function expandSpace(input) {
  let xExpandedCoord = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].indexOf("#") == -1) {
      xExpandedCoord.push(i);
    }
  }

  const inputTransposed = transpose(input);
  let yExpandedCoord = [];
  for (let i = 0; i < inputTransposed.length; i++) {
    if (inputTransposed[i].indexOf("#") == -1) {
      yExpandedCoord.push(i);
    }
  }

  return [xExpandedCoord, yExpandedCoord];
}

function accountForExpansion(start, end, expandedCoords, multiplier) {
  let expandedCoordsForPositions = expandedCoords.filter(
    (v) => (v > start && v < end) || (v > end && v < start),
  );

  return (
    Math.abs(start - end) - expandedCoordsForPositions.length + expandedCoordsForPositions.length * multiplier
  );
}

function transpose(input) {
  let transposed = [];
  for (let i = 0; i < input[0].length; i++) {
    let transposedLine = "";
    for (let j = 0; j < input.length; j++) {
      transposedLine += input[j][i];
    }
    transposed.push(transposedLine);
  }

  return transposed;
}

const testResult1 = calculateShortestDistanceBetweenStarts(testInput1, 2);
console.assert(testResult1 == 374, "Expected: " + 374 + " but got: " + testResult1);
console.log("Test resul 1: " + testResult1);

const testResult2 = calculateShortestDistanceBetweenStarts(testInput1, 100);
console.assert(testResult2 == 8410, "Expected: " + 8410 + " but got: " + testResult2);
console.log("Test resul 2: " + testResult2);

let inputFile = fs
  .readFileSync(path.resolve(__dirname, "day11input.txt"), "utf-8")
  .split("\n")
  .filter((v) => v.length != 0);
const result1 = calculateShortestDistanceBetweenStarts(inputFile, 2);
console.log("Result 1: " + result1);

const result2 = calculateShortestDistanceBetweenStarts(inputFile, 1000000);
console.log("Result 2: " + result2);
