const path = require("path");
const fs = require("fs");

const testInput1 = ["-L|F7", "7S-7|", "L|7||", "-L-J|", "L|-JF"];
const testInput2 = ["7-F7-", ".FJ|7", "SJLL7", "|F--J", "LJ.LJ"];
const testInput3 = [
  "FF7FSF7F7F7F7F7F---7",
  "L|LJ||||||||||||F--J",
  "FL-7LJLJ||||||LJL-77",
  "F--JF--7||LJLJ7F7FJ-",
  "L---JF-JLJ.||-FJLJJ7",
  "|F|F-JF---7F7-L7L|7|",
  "|FFJF7L7F-JF7|JL---7",
  "7-L-JL7||F7|L7F-7F7|",
  "L.L7LFJ|||||FJL7||LJ",
  "L7JLJL-JLJLJL--JLJ.L",
];

const pipeTypeMap = {
  "|": {
    top: -1,
    bottom: 1,
    left: 0,
    right: 0,
  },
  "-": {
    top: 0,
    bottom: 0,
    left: -1,
    right: 1,
  },
  L: {
    top: -1,
    bottom: 0,
    left: 0,
    right: 1,
  },
  J: {
    top: -1,
    bottom: 0,
    left: -1,
    right: 0,
  },
  7: {
    top: 0,
    bottom: 1,
    left: -1,
    right: 0,
  },
  F: {
    top: 0,
    bottom: 1,
    left: 0,
    right: 1,
  },
  ".": {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

const toKeyMap = {
  top: 0,
  bottom: 0,
  left: 1,
  right: 1,
};

const inverseToKeyMap = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const connectsToNext = {
  "|": false,
  "-": true,
  L: true,
  J: false,
  7: false,
  F: true,
  ".": false,
};

function findStart(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] == "S") return [i, j];
    }
  }
}

function evaluateStartType(matrix, start) {
  if (start[0] == 0 && start[1] == 0) {
    return [
      [0, 1],
      [0, 1],
    ];
  }
  let previousPosition;
  let nextPosition;

  if (start[0] == 0) {
    if (pipeTypeMap[matrix[0][start[1] - 1]].right == 1) {
      previousPosition = [0, -1];
    }
    if (pipeTypeMap[matrix[0][start[1] + 1]].left == -1) {
      if (!previousPosition) {
        previousPosition = [0, 1];
        nextPosition = [1, 0];
      }
    } else {
      nextPosition = [1, 0];
    }
  } else if (start[1] == 0) {
    if (pipeTypeMap[matrix[start[0] - 1][0]].bottom == 1) {
      previousPosition = [-1, 0];
    }
    if (pipeTypeMap[matrix[start[0] + 1][0]].top == -1) {
      if (!previousPosition) {
        previousPosition = [0, 1];
        nextPosition = [1, 0];
      }
    } else {
      nextPosition = [1, 0];
    }
  } else {
    if (pipeTypeMap[matrix[start[0] - 1][start[1]]].bottom == 1) {
      previousPosition = [-1, 0];
    }
    if (pipeTypeMap[matrix[start[0]][start[1] + 1]].left == -1) {
      if (!previousPosition) {
        previousPosition = [0, 1];
      } else {
        nextPosition = [0, 1];
      }
    }
    if (pipeTypeMap[matrix[start[0] + 1][start[1]]].top == -1) {
      if (!previousPosition) {
        previousPosition = [1, 0];
      } else {
        nextPosition = [1, 0];
      }
    }
    if (pipeTypeMap[matrix[start[0]][start[1] - 1]].right == 1) {
      if (!previousPosition) {
        previousPosition = [0, -1];
      } else {
        nextPosition = [0, -1];
      }
    }
  }

  const startTypeValue = [previousPosition, nextPosition].reduce((pipeType, toPosition) => {
    if (toPosition[0] != 0) {
      pipeType = {
        ...pipeType,
        [toPosition[0] == -1 ? "top" : "bottom"]: toPosition[0],
      };
    } else if (toPosition[1] != 0) {
      pipeType = {
        ...pipeType,
        [toPosition[1] == -1 ? "left" : "right"]: toPosition[1],
      };
    }

    return pipeType;
  }, {});

  return Object.keys(pipeTypeMap).find(
    (k) =>
      pipeTypeMap[k].top == (startTypeValue.top ? startTypeValue.top : 0) &&
      pipeTypeMap[k].right == (startTypeValue.right ? startTypeValue.right : 0) &&
      pipeTypeMap[k].bottom == (startTypeValue.bottom ? startTypeValue.bottom : 0) &&
      pipeTypeMap[k].left == (startTypeValue.left ? startTypeValue.left : 0),
  );
}

function calculateStepsToFarthestPoint(matrix) {
  const start = findStart(matrix);
  const startType = evaluateStartType(matrix, start);
  let currentToKeyA = Object.keys(pipeTypeMap[startType]).filter((k) => pipeTypeMap[startType][k] != 0)[0];
  let currentToKeyB = Object.keys(pipeTypeMap[startType]).filter((k) => pipeTypeMap[startType][k] != 0)[1];
  let nextA = [...start];
  let nextB = [...start];

  nextA[toKeyMap[currentToKeyA]] += pipeTypeMap[startType][currentToKeyA];
  nextB[toKeyMap[currentToKeyB]] += pipeTypeMap[startType][currentToKeyB];

  let nextTypeA = matrix[nextA[0]][nextA[1]];
  let nextTypeB = matrix[nextB[0]][nextB[1]];

  let stepsToPositionA = [[...nextA]];
  let stepsToPositionB = [[...nextB]];

  while (nextA[0] != nextB[0] || nextA[1] != nextB[1]) {
    currentToKeyA = Object.keys(pipeTypeMap[nextTypeA]).find(
      (k) => pipeTypeMap[nextTypeA][k] != 0 && k != inverseToKeyMap[currentToKeyA],
    );
    currentToKeyB = Object.keys(pipeTypeMap[nextTypeB]).find(
      (k) => pipeTypeMap[nextTypeB][k] != 0 && k != inverseToKeyMap[currentToKeyB],
    );
    nextA[toKeyMap[currentToKeyA]] += pipeTypeMap[nextTypeA][currentToKeyA];
    nextB[toKeyMap[currentToKeyB]] += pipeTypeMap[nextTypeB][currentToKeyB];

    nextTypeA = matrix[nextA[0]][nextA[1]];
    nextTypeB = matrix[nextB[0]][nextB[1]];

    stepsToPositionA.push([...nextA]);
    stepsToPositionB.push([...nextB]);
  }

  return [stepsToPositionA, stepsToPositionB, start];
}

const testInput1Result1 = calculateStepsToFarthestPoint(testInput1)[0].length;
console.assert(testInput1Result1 == 4, "Expected: " + 4 + " but got: " + testInput1Result1);
console.log("Test input 1 result 1: " + testInput1Result1);

const testInput2Result1 = calculateStepsToFarthestPoint(testInput2)[0].length;
console.assert(testInput2Result1 == 8, "Expected: " + 8 + " but got: " + testInput2Result1);
console.log("Test input 2 result 1: " + testInput2Result1);

const testInput3Result2 = calculateStepsToFarthestPoint(testInput3);
const testInput3Result2A = [testInput3Result2[2], ...testInput3Result2[0], ...testInput3Result2[1].slice(1)];
console.log("Test input 3 result 2: " + printTileCheat(testInput3, testInput3Result2A));

let inputFile = fs
  .readFileSync(path.resolve(__dirname, "day10input.txt"), "utf-8")
  .split("\n")
  .filter((v) => v.length != 0);
const result1 = calculateStepsToFarthestPoint(inputFile)[0].length;
console.log("Result 1: " + result1);
