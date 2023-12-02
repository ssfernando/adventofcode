
const fs = require('fs');
const readline = require('readline');

const wordToNumber = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9",
}

const test = [
  "two1nine",
  "eightwothree",
  "abcone2threexyz",
  "xtwone3four",
  "4nineeightseven2",
  "zoneight234",
  "7pqrstsixteen",
]

async function processLineByLine(input) {
  const pattern = /(?=([\d]|one|two|three|four|five|six|seven|eight|nine))/g;
  let sum = 0;

  for await (const line of input) {
    const matches = [...line.matchAll(pattern)];

    if (matches.length > 0) {
      sum += Number(convertWordToNumber(matches[0][1]) + convertWordToNumber(matches[matches.length - 1][1]));
    }
  }

  return sum;
}

function convertWordToNumber(value) {
  return value.match(/[a-z]/) ? wordToNumber[value] : value;
}

processLineByLine(test)
.then(result => {
  console.assert(result == 281, "Expected: " + 281 + " but got: " + result);

  processLineByLine(readline.createInterface({
    input: fs.createReadStream('day1input.txt'),
    crlfDelay: Infinity
  })).then(console.log);
});
