const path = require("path");
const fs = require("fs");

const testInput = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

function getLowestLocationNumber1(inputObject) {
  let smallerLocation = Number.MAX_VALUE;

  for (const seed of inputObject.seeds) {
    const finalLocaltion = convertCoordinate(seed, [...inputObject.maps]);

    if (finalLocaltion <= smallerLocation) {
      smallerLocation = finalLocaltion;
    }
  }

  return smallerLocation;
}

function getLowestLocationNumber2(inputObject) {
  let smallerLocation = -1;

  for (let i = 0; i < inputObject.seeds.length; i = i + 2) {
    for (
      let j = inputObject.seeds[i];
      j < inputObject.seeds[i] + inputObject.seeds[i + 1];
      j++
    ) {
      const finalLocaltion = convertCoordinate(j, [...inputObject.maps]);

      if (smallerLocation == -1 || finalLocaltion <= smallerLocation) {
        smallerLocation = finalLocaltion;
      }
    }
  }

  return smallerLocation;
}

function convertCoordinate(source, maps) {
  if (maps.length == 0) {
    return source;
  }

  let newSource = -1;
  for (const line of maps.shift()) {
    if (source >= line[1] && source <= line[1] + line[2]) {
      newSource = line[0] + (source - line[1]);
      break;
    }
  }

  return convertCoordinate(newSource == -1 ? source : newSource, maps);
}

function convertInput(input) {
  const seeds = input
    .match(/seeds: (?<seeds>[0-9 ]*?)\n/)
    .groups.seeds.split(" ")
    .map((n) => Number(n));
  const seedToSoilMap = input
    .match(
      /seed-to-soil map:\n(?<seedToSoilMap>[0-9 \n]*?)soil-to-fertilizer map/,
    )
    .groups.seedToSoilMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const soilToFertilizerMap = input
    .match(
      /soil-to-fertilizer map:\n(?<soilToFertilizerMap>[0-9 \n]*?)fertilizer-to-water map/,
    )
    .groups.soilToFertilizerMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const fertilizerToWaterMap = input
    .match(
      /fertilizer-to-water map:\n(?<fertilizerToWaterMap>[0-9 \n]*?)water-to-light map/,
    )
    .groups.fertilizerToWaterMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const waterToLightMap = input
    .match(
      /water-to-light map:\n(?<waterToLightMap>[0-9 \n]*?)light-to-temperature map/,
    )
    .groups.waterToLightMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const lightToTemperatureMap = input
    .match(
      /light-to-temperature map:\n(?<lightToTemperatureMap>[0-9 \n]*?)temperature-to-humidity map/,
    )
    .groups.lightToTemperatureMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const temperatureToHumidityMap = input
    .match(
      /temperature-to-humidity map:\n(?<temperatureToHumidityMap>[0-9 \n]*?)humidity-to-location map/,
    )
    .groups.temperatureToHumidityMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));
  const humidityToLocationMap = input
    .match(/humidity-to-location map:\n(?<humidityToLocationMap>[0-9 \n]*?)$/)
    .groups.humidityToLocationMap.replaceAll(/\n/g, ";")
    .replaceAll(";;", "")
    .split(";")
    .map((line) => line.split(" ").map((n) => Number(n)));

  return {
    seeds,
    maps: [
      seedToSoilMap,
      soilToFertilizerMap,
      fertilizerToWaterMap,
      waterToLightMap,
      lightToTemperatureMap,
      temperatureToHumidityMap,
      humidityToLocationMap,
    ],
  };
}

const testInputObject1 = convertInput(testInput);

const testResult1 = getLowestLocationNumber1(testInputObject1);
console.assert(
  testResult1 == 35,
  "Expected: " + 35 + " but got: " + testResult1,
);
console.log("Test result 1: " + testResult1);

const testResult2 = getLowestLocationNumber2(testInputObject1);
console.assert(
  testResult2 == 46,
  "Expected: " + 46 + " but got: " + testResult2,
);
console.log("Test result 2: " + testResult2);

const inputObject1 = convertInput(
  fs.readFileSync(path.resolve(__dirname, "day5input.txt"), "utf-8"),
);
const result1 = getLowestLocationNumber1(inputObject1);
console.log("Result 1: " + result1);

const result2 = getLowestLocationNumber2(inputObject1);
console.log("Result 2: " + result2);
