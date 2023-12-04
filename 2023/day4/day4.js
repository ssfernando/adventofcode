const path = require("path");
const fs = require("fs");
const readline = require("readline");

const testInput = [
  "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
  "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
  "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
  "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
  "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
  "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
];

async function calculateTotalCardPoints(input) {
  let cards = [];
  let sum = 0;

  for await (const card of input) {
    const cardNumbers = card.split(/:[ ]+/)[1].split(" | ")[0].split(/ +/);
    const winningNumbers = card.split(/:[ ]+/)[1].split(" | ")[1].split(/ +/);

    let points = 0;

    for (const cardNumber of cardNumbers) {
      if (winningNumbers.includes(cardNumber)) {
        if (points == 0) {
          points = 1;
        } else {
          points *= 2;
        }
      }
    }

    sum += points;
  }

  return sum;
}

async function calculateTotalScrachCards(input) {
  let copies = {};
  let i = 0;
  let sum = 0;

  for await (const card of input) {
    const cardNumbers = card.split(/:[ ]+/)[1].split(" | ")[0].split(/ +/);
    const winningNumbers = card.split(/:[ ]+/)[1].split(" | ")[1].split(/ +/);

    copies[i] = copies[i] ? copies[i] + 1 : 1;

    let j = i + 1;
    for (const cardNumber of cardNumbers) {
      if (winningNumbers.includes(cardNumber)) {
        if (copies[j]) {
          copies[j] += copies[i] * 1;
        } else {
          copies[j] = copies[i];
        }
        j++;
      }
    }

    sum += copies[i];

    i++;
  }

  return sum;
}

calculateTotalCardPoints(testInput).then((testResult1) => {
  console.assert(
    testResult1 == 13,
    "Expected: " + 13 + " but got: " + testResult1,
  );
  console.log("Test result 1: " + testResult1);

  calculateTotalScrachCards(testInput).then((testResult2) => {
    console.assert(
      testResult2 == 30,
      "Expected: " + 30 + " but got: " + testResult2,
    );
    console.log("Test result 2: " + testResult2);

    calculateTotalCardPoints(
      readline.createInterface({
        input: fs.createReadStream(path.resolve(__dirname, "day4input.txt")),
        crlfDelay: Infinity,
      }),
    ).then((result1) => {
      console.log("Result 1: " + result1);

      calculateTotalScrachCards(
        readline.createInterface({
          input: fs.createReadStream(path.resolve(__dirname, "day4input.txt")),
          crlfDelay: Infinity,
        }),
      ).then((result2) => {
        console.log("Result 2: " + result2);
      });
    });
  });
});
