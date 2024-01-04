import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

// @ts-ignore
const getWholeNumber = (string: string, currentAnswer: string): string => {
  if (isNaN(Number(string[0]))) {
    return currentAnswer;
  } else {
    return getWholeNumber(string.slice(1), currentAnswer + String(string[0]));
  }
};

const checkSymbolValidity = (symbol: string) => {
  if (!symbol || symbol.length === 0) return false;
  return !(symbol === "." || !isNaN(Number(symbol)));
};

const checkNeighbour = (firstIndex: number, length: number, string?: string) => {
  if (!string || string.length === 0) return false;
  const first = string[firstIndex - 1] ? (firstIndex - 1) : firstIndex;
  const last = string[firstIndex + length] ? firstIndex + length + 1 : firstIndex + length;
  const slice = string.slice(first, last);
  for (let i = 0; i < slice.length; i++) {
    if (checkSymbolValidity(slice[i])) {
      return true;
    }
  }
  return false;
};

const checkValidity = ([prevString, string, nextString]: string[], firstIndex: number, length: number) => {
  if (checkSymbolValidity(string[firstIndex - 1])
    || checkSymbolValidity(string[firstIndex + length])) {
    return true;
  }
  if (checkNeighbour(firstIndex, length, prevString)) return true;
  return checkNeighbour(firstIndex, length, nextString);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const strings = input.split(`\n`);
  let answer = 0;
  strings.forEach((string, index) => {
    const numbers: (string | number)[] = [];
    for (let i = 0; i < string.length; i++) {
      if (!isNaN(Number(string[i]))) {
        if (numbers.length === 0
          || (typeof (numbers[numbers.length - 1]) === "number"
            && typeof (numbers[numbers.length - 2]) === "string"
            // @ts-ignore
            && i > (numbers[numbers.length - 1] + numbers[numbers.length - 2].length))
        ) {
          numbers.push(getWholeNumber(string.slice(i), ""));
          numbers.push(i);
        }
      }
    }

    for (let i = 0; i < numbers.length; i += 2) {
      if (checkValidity([
          strings[index - 1],
          string,
          strings[index + 1],
        ],
        // @ts-ignore
        numbers[i + 1], numbers[i].length)) {
        answer = answer + Number(numbers[i]);
      }
    }
  });
  return answer;
};

const getLeftNeighbour = (string: string, index: number, current = ""): string => {
  const checkedInd = index - 1;
  if (isNaN(Number(string[checkedInd]))) {
    return current;
  } else {
    return getLeftNeighbour(string, checkedInd, string[checkedInd] + current);
  }
};

const getRightNeighbour = (string: string, index: number, current = ""): string => {
  const checkedInd = index + 1;

  if (isNaN(Number(string[checkedInd]))) {
    return current;
  } else {
    return getRightNeighbour(string, checkedInd, current + string[checkedInd]);
  }
};

const getClosedNeighbour = (string: string, index: number, current: string) => {
  const left = getLeftNeighbour(string, index);
  const right = getRightNeighbour(string, index);

  return Number((!isNaN(Number(left)) ? left : "")
    + current
    + ((!isNaN(Number(right)) ? right : "")));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const strings = input.split(`\n`);
  let answer = 0;

  strings.forEach((string: string, stringIndex) => {
    for (let i = 0; i < string.length; i++) {
      if (string[i] === "*") {
        const leftNeighbour = Number(getLeftNeighbour(string, i));
        const rightNeighbour = Number(getRightNeighbour(string, i));
        const upperNeighbour = strings[stringIndex - 1] && !isNaN(Number(strings[stringIndex - 1][i]))
          ? getClosedNeighbour(strings[stringIndex - 1], i, strings[stringIndex - 1][i])
          : 0;
        const downNeighbour = strings[stringIndex + 1] && !isNaN(Number(strings[stringIndex + 1][i]))
          ? getClosedNeighbour(strings[stringIndex + 1], i, strings[stringIndex + 1][i])
          : 0;
        const upperLeft = upperNeighbour ? 0 : Number(getLeftNeighbour(strings[stringIndex - 1], i));
        const upperRight = upperNeighbour ? 0 : Number(getRightNeighbour(strings[stringIndex - 1], i));
        const downLeft = downNeighbour ? 0 : Number(getLeftNeighbour(strings[stringIndex + 1], i));
        const downRight = downNeighbour ? 0 : Number(getRightNeighbour(strings[stringIndex + 1], i));
        const filtered = [leftNeighbour, rightNeighbour, upperNeighbour, downNeighbour, upperLeft, upperRight, downLeft, downRight].filter(el => el > 0);

        if (filtered.length === 2) {
          answer += filtered.reduce((acc, curr) => {
            return acc * curr;
          });
        }
      }
    }
  });
  return answer;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
