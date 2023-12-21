import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  return lines.reduce((acc, value) => {
    const first: number[] = [];
    let last;
    for (let i = 0; i < value.length; i++) {
      if (!isNaN(Number(value[i]))) {
        if (!first[0]) {
          first[0] = Number(value[i]);
          first[1] = i;
        }
        last = value[i];
      }
    }
    return acc + Number(String(first[0]) + String(last ?? ""));
  }, 0);
};

const writeIndex = (array: number[]) =>
  (string: string) =>
    (word: string, value: number) => {
      if (string.indexOf(word) > -1) {
        array[string.indexOf(word)] = value;
        array[string.lastIndexOf(word)] = value;
      }
    };

const getWordIndexes = (string: string) => {
  const indexes: number[] = [];
  const writeStringToIndexes = writeIndex(indexes)(string);
  writeStringToIndexes("one", 1);
  writeStringToIndexes("two", 2);
  writeStringToIndexes("three", 3);
  writeStringToIndexes("four", 4);
  writeStringToIndexes("five", 5);
  writeStringToIndexes("six", 6);
  writeStringToIndexes("seven", 7);
  writeStringToIndexes("eight", 8);
  writeStringToIndexes("nine", 9);

  return indexes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  return lines.reduce((acc, value) => {
    let firstToSum;
    let lastToSum;
    const first: number[] = [], last: number[] = [];
    for (let i = 0; i < value.length; i++) {
      const wordIndexes = getWordIndexes(value);
      if (!isNaN(Number(value[i]))) {
        if (!first[0]) {
          first[0] = Number(value[i]);
          first[1] = i;
        }
        last[0] = Number(value[i]);
        last[1] = i;
      }

      const firstFromWords: number[] = [];
      wordIndexes.forEach((value, index) => {
        if (firstFromWords.length === 0 && value) {
          firstFromWords[0] = value;
          firstFromWords[1] = index;
        }
      });
      if (first.length !== 0) {
        firstToSum = firstFromWords[1] < first[1] ? firstFromWords[0] : first[0];
      } else firstToSum = firstFromWords[0];

      if (last.length !== 0) {
        lastToSum = wordIndexes.length > last[1] ? wordIndexes[wordIndexes.length - 1] : last[0];
      } else lastToSum = wordIndexes[wordIndexes.length - 1];
    }

    return acc + Number(String(firstToSum) + String(lastToSum));
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eighttwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
