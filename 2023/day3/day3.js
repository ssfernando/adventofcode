const path = require("path");
const fs = require("fs");
const readline = require("readline");

const testInput = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

async function getPartNumberSum(input) {
  let topLine;
  let middleLine;
  let bottomLine;
  let i = 0;
  let lineResults = [];

  for await (const line of input) {
    if (i == 0) {
      bottomLine = line;
    } else if (i == 1) {
      middleLine = bottomLine;
      bottomLine = line;
      lineResults.push(getResultForLine(undefined, middleLine, line, i - 1));
    } else {
      topLine = middleLine;
      middleLine = bottomLine;
      bottomLine = line;
      lineResults.push(
        getResultForLine(topLine, middleLine, bottomLine, i - 1),
      );
    }

    i++;
  }

  lineResults.push(getResultForLine(middleLine, bottomLine, undefined, i - 1));

  const adjacentPartNumbersSum = sumAdjacentPartNumbers(
    lineResults.filter((lineResult) => lineResult.length > 0),
  );
  const gearRatio = calculateGearRatio(
    lineResults.filter((lineResult) => lineResult.length > 0),
  );

  return [adjacentPartNumbersSum, gearRatio];
}

function getResultForLine(top, middle, bottom, middleLineNumber) {
  const linePartNumbers = getLinePartNumbers(middle);
  let result = [];

  for (let partNumber of linePartNumbers) {
    const sydeSymbol = getSydeSymbol(
      partNumber[1],
      partNumber[0].length,
      middle,
      middleLineNumber,
    );
    if (sydeSymbol) {
      // console.log(partNumber[0]);
      result.push([Number(partNumber[0]), sydeSymbol]);
    } else {
      const adjacentSymbol =
        getAdjacentSymbol(
          partNumber[1],
          partNumber[0].length,
          top,
          middleLineNumber - 1,
        ) ||
        getAdjacentSymbol(
          partNumber[1],
          partNumber[0].length,
          bottom,
          middleLineNumber + 1,
        );
      // console.log(partNumber[0]);

      if (adjacentSymbol) {
        result.push([Number(partNumber[0]), adjacentSymbol]);
      }
    }
  }

  return result;
}

function getLinePartNumbers(line) {
  let number = "";
  let indexOf = -1;
  let result = [];

  for (let i = 0; i < line.length; i++) {
    if (line[i].match(/[\d]/)) {
      number += line[i];
      if (indexOf == -1) {
        indexOf = i;
      }
    } else {
      if (number) {
        result.push([number, indexOf]);
        number = "";
        indexOf = -1;
      }
    }
  }

  if (number) {
    result.push([number, indexOf]);
  }

  return result;
}

function getSydeSymbol(indexOf, size, line, lineNumber) {
  const containsLeft = indexOf == 0 ? false : line[indexOf - 1] != ".";
  const containsRight =
    indexOf + size >= line.length ? false : line[indexOf + size] != ".";

  return containsLeft || containsRight
    ? {
        symbol: containsLeft ? line[indexOf - 1] : line[indexOf + size],
        lineNumber: lineNumber,
        position: containsLeft ? indexOf - 1 : indexOf + size,
      }
    : null;
}

function getAdjacentSymbol(indexOf, size, adjacentLine, lineNumber) {
  if (!adjacentLine) return null;

  const maxAdjacentIndex =
    indexOf + size == adjacentLine.length ? indexOf + size - 1 : indexOf + size;
  let adjacentSymbol = null;

  for (let i = indexOf == 0 ? 0 : indexOf - 1; i <= maxAdjacentIndex; i++) {
    if (adjacentLine[i] != ".") {
      adjacentSymbol = {
        symbol: adjacentLine[i],
        lineNumber: lineNumber,
        position: i,
      };
      break;
    }
  }

  return adjacentSymbol;
}

function sumAdjacentPartNumbers(lineResults) {
  return lineResults
    .flatMap((lineResult) => lineResult)
    .reduce((partialSum, a) => partialSum + a[0], 0);
}

function calculateGearRatio(lineResults) {
  const gearMap = lineResults
    .flatMap((lineResult) => lineResult)
    .filter((lineResult) => lineResult[1].symbol == "*")
    .reduce((pv, c) => {
      if (pv["l" + c[1].lineNumber + "p" + c[1].position]) {
        pv["l" + c[1].lineNumber + "p" + c[1].position] = [
          ...pv["l" + c[1].lineNumber + "p" + c[1].position],
          c[0],
        ];
      } else {
        pv["l" + c[1].lineNumber + "p" + c[1].position] = [c[0]];
      }

      return pv;
    }, {});

  let gearRatio = 0;

  for (const gear in gearMap) {
    if (gearMap[gear].length == 2) {
      gearRatio += Number(gearMap[gear][0]) * Number(gearMap[gear][1]);
    }
  }

  return gearRatio;
}

getPartNumberSum(testInput).then((testResult) => {
  console.assert(
    testResult[0] == 4361,
    "Expected: " + 4361 + " but got: " + testResult[0],
  );
  console.log("Test result: " + testResult[0]);
  console.assert(
    testResult[1] == 467835,
    "Expected: " + 467835 + " but got: " + testResult[1],
  );
  console.log("Test result: " + testResult[1]);

  getPartNumberSum(
    readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, "day3input.txt")),
      crlfDelay: Infinity,
    }),
  ).then((result) => {
    console.log("result part 1: " + result[0]);
    console.log("result part 2: " + result[1]);
  });
});
