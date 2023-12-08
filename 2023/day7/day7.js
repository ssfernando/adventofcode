const path = require("path");
const fs = require("fs");

const testInput = ["32T3K 765", "T55J5 684", "KK677 28", "KTJJT 220", "QQQJA 483"];

const cardValues = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const cardValues2 = {
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const handTypes = {
  HIGH: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF: 4,
  FULL_HOUSE: 5,
  FOUR_OF: 6,
  FIVE_OF: 7,
};

function getHandValue(hand) {
  let handCountMap = {};
  for (let i = 0; i < hand[0].length; i++) {
    handCountMap[hand[0][i]] = !handCountMap[hand[0][i]] ? 1 : handCountMap[hand[0][i]] + 1;
  }

  const handCountMapValues = Object.values(handCountMap);

  if (handCountMapValues.indexOf(5) > -1) {
    return handTypes.FIVE_OF;
  } else if (handCountMapValues.indexOf(4) > -1) {
    return handTypes.FOUR_OF;
  } else if (handCountMapValues.indexOf(3) > -1 && handCountMapValues.indexOf(2) > -1) {
    return handTypes.FULL_HOUSE;
  } else if (handCountMapValues.indexOf(3) > -1) {
    return handTypes.THREE_OF;
  } else if (handCountMapValues.filter((v) => v == 2).length == 2) {
    return handTypes.TWO_PAIR;
  } else if (handCountMapValues.filter((v) => v == 2).length == 1) {
    return handTypes.PAIR;
  } else {
    return handTypes.HIGH;
  }
}

function getHandValue2(hand) {
  let scoreWithoutWilds = getHandValue([
    hand[0]
      .split("")
      .filter((v) => v != "J")
      .join(""),
    hand[1],
  ]);
  let numWild = hand[0].split("").filter((v) => v == "J").length;

  if (numWild === 0) {
    return getHandValue(hand);
  }

  if (numWild === 1) {
    if (scoreWithoutWilds === handTypes.FOUR_OF) {
      return handTypes.FIVE_OF;
    }
    if (scoreWithoutWilds === handTypes.FULL_HOUSE) {
      return handTypes.FOUR_OF;
    }
    if (scoreWithoutWilds === handTypes.THREE_OF) {
      return handTypes.FOUR_OF;
    }
    if (scoreWithoutWilds === handTypes.TWO_PAIR) {
      return handTypes.FULL_HOUSE;
    }
    if (scoreWithoutWilds === handTypes.PAIR) {
      return handTypes.THREE_OF;
    }
    if (scoreWithoutWilds === handTypes.HIGH) {
      return handTypes.PAIR;
    }
  }

  if (numWild === 2) {
    if (scoreWithoutWilds === handTypes.FULL_HOUSE) {
      return handTypes.FIVE_OF;
    }
    if (scoreWithoutWilds === handTypes.THREE_OF) {
      return handTypes.FIVE_OF;
    }
    if (scoreWithoutWilds === handTypes.TWO_PAIR) {
      return handTypes.FOUR_OF;
    }
    if (scoreWithoutWilds === handTypes.PAIR) {
      return handTypes.FOUR_OF;
    }
    if (scoreWithoutWilds === handTypes.HIGH) {
      return handTypes.THREE_OF;
    }
  }

  if (numWild === 3) {
    if (scoreWithoutWilds === handTypes.PAIR) {
      return handTypes.FIVE_OF;
    }
    if (scoreWithoutWilds === handTypes.HIGH) {
      return handTypes.FOUR_OF;
    }
  }

  if (numWild === 4 || numWild === 5) {
    return handTypes.FIVE_OF;
  }
}

function sortByHandValue(handA, handB) {
  if (handA[0] - handB[0] == 0) {
    for (let i = 0; i < 5; i++) {
      if (cardValues[handA[1][i]] - cardValues[handB[1][i]] != 0) {
        return cardValues[handA[1][i]] - cardValues[handB[1][i]];
      }
    }
  } else {
    return handA[0] - handB[0];
  }

  return 0;
}

function sortByHandValue2(handA, handB) {
  if (handA[0] - handB[0] == 0) {
    for (let i = 0; i < 5; i++) {
      if (cardValues2[handA[1][i]] - cardValues2[handB[1][i]] != 0) {
        return cardValues2[handA[1][i]] - cardValues2[handB[1][i]];
      }
    }
  } else {
    return handA[0] - handB[0];
  }

  return 0;
}

function getTotalWinnings(hands) {
  return hands
    .map((hand) => [getHandValue(hand), ...hand])
    .sort((handA, handB) => sortByHandValue(handA, handB))
    .reduce((partialSum, hand, index) => partialSum + hand[2] * (index + 1), 0);
}

function getTotalWinnings2(hands) {
  return hands
    .map((hand) => [getHandValue2(hand), ...hand])
    .sort((handA, handB) => sortByHandValue2(handA, handB))
    .reduce((partialSum, hand, index) => partialSum + hand[2] * (index + 1), 0);
}

function parseInput(lines) {
  return lines.map((line) => [line.split(" ")[0], line.split(" ")[1]]);
}

const testResult1 = getTotalWinnings(parseInput(testInput));
console.assert(testResult1 == 6440, "Expected :" + 6440 + " but got: " + testResult1);
console.log("Test result 1: " + testResult1);

const testResult2 = getTotalWinnings2(parseInput(testInput));
console.assert(testResult2 == 5905, "Expected :" + 5905 + " but got: " + testResult1);
console.log("Test result 2: " + testResult2);

let inputFile = fs.readFileSync(path.resolve(__dirname, "day7input.txt"), "utf-8").split("\n");
inputFile.pop();
const result1 = getTotalWinnings(parseInput(inputFile));
console.log("Result 1: " + result1);

const result2 = getTotalWinnings2(parseInput(inputFile));
console.log("Result 2: " + result2);
