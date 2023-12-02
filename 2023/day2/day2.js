const fs = require("fs");
const readline = require("readline");

const testGames = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

const elfSet = {
  red: 12,
  green: 13,
  blue: 14,
};

async function convertGames(games) {
  let result = [];
  let numberPattern = /[\d]*/;
  let colorPattern = /[a-z]*/g;
  for await (const game of games) {
    const sets = game.substring(game.indexOf(":") + 2).split("; ");
    let gameArray = [];

    for (const set of sets) {
      const cubesRevelead = set.split(", ");
      let setObject = {};

      for (const cubeCount of cubesRevelead) {
        setObject = {
          ...setObject,
          [cubeCount.match(colorPattern).find((s) => s.length > 0)]: cubeCount
            .match(numberPattern)
            .find((s) => s.length > 0),
        };
      }

      gameArray = [...gameArray, setObject];
    }

    result = [...result, gameArray];
  }

  return result;
}

function getPossibleGamesCount(games, elfSet) {
  let result = 0;

  for (let i = 0; i < games.length; i++) {
    let isPossible = true;
    for (let j = 0; j < games[i].length; j++) {
      isPossible =
        elfSet.red >= getColorValue(games[i][j], "red") &&
        elfSet.green >= getColorValue(games[i][j], "green") &&
        elfSet.blue >= getColorValue(games[i][j], "blue");

      if (!isPossible) {
        break;
      }
    }

    if (isPossible) {
      result += i + 1;
    }
  }

  return result;
}

function getSumOfPowerOfMinimumSetOfCubes(games) {
  let powers = [];
  for (let i = 0; i < games.length; i++) {
    let red = 0;
    let green = 0;
    let blue = 0;
    for (let j = 0; j < games[i].length; j++) {
      red =
        red < getColorValue(games[i][j], "red")
          ? getColorValue(games[i][j], "red")
          : red;
      green =
        green < getColorValue(games[i][j], "green")
          ? getColorValue(games[i][j], "green")
          : green;
      blue =
        blue < getColorValue(games[i][j], "blue")
          ? getColorValue(games[i][j], "blue")
          : blue;
    }

    powers = [...powers, red * green * blue];
  }

  return powers.reduce((partialSum, a) => partialSum + a, 0);
}

function getColorValue(setObject, color) {
  return setObject[color] != null ? Number(setObject[color]) : 1;
}

convertGames(testGames).then((testGamesArray) => {
  const count = getPossibleGamesCount(testGamesArray, elfSet);
  console.assert(count == 8, "Expected :" + 8 + " but got: " + count);

  const totalPower = getSumOfPowerOfMinimumSetOfCubes(testGamesArray);
  console.assert(
    totalPower == 2286,
    "Expected :" + 2286 + " but got: " + totalPower,
  );

  convertGames(
    readline.createInterface({
      input: fs.createReadStream("day2input.txt"),
      crlfDelay: Infinity,
    }),
  ).then((gamesArray) => {
    const resultPart1 = getPossibleGamesCount(gamesArray, elfSet);
    console.log("result part 1: " + resultPart1);

    const resultPart2 = getSumOfPowerOfMinimumSetOfCubes(gamesArray);
    console.log("result part 2: " + resultPart2);
  });
});
