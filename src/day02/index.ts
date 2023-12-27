import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type SetType = { red?: number, blue?: number, green?: number };

const MAX_GREEN = 13;
const MAX_RED = 12;
const MAX_BLUE = 14;

const getGames = (input: string): [string, SetType[]] => {
  return input
    .split("Game ")
    .map(val => val.split(": "))
    .map(val => {
      if (val.length === 1) return "";
      const sets = val[1]
        .split("; ")
        .map(cubes => cubes.replace(/\n+/g, ""))
        .map(cubes => cubes.split(", "))
        .reduce<SetType[]>((acc, cubes, index) => {
          acc[index] = {};
          cubes.forEach(cube => {
            if (cube.indexOf("red") > 0) {
              acc[index]["red"] = Number(cube.split(" ")[0]);
            }
            if (cube.indexOf("blue") > 0) {
              acc[index]["blue"] = Number(cube.split(" ")[0]);
            }
            if (cube.indexOf("green") > 0) {
              acc[index]["green"] = Number(cube.split(" ")[0]);
            }
          });
          return acc;
        }, []);
      return [Number(val[0]), sets];
    }) as [string, SetType[]];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getGames(input).reduce((acc, game) => {
    let isPossible = true;
    if (game.length === 0) return acc;
    // @ts-ignore
    game[1]?.forEach(set => {
      if (set["green"] > MAX_GREEN
        || set["blue"] > MAX_BLUE
        || set["red"] > MAX_RED) isPossible = false;
    });

    return isPossible ? acc + (game[0] as number) : acc;
  }, 0)
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getGames(input).reduce((acc, game) => {
    const max: SetType = {
      red: 0,
      blue: 0,
      green: 0,
    };
    if (game.length === 0) return acc;
    // @ts-ignore
    game[1]?.forEach(set => {
      if (set["green"] > (max.green || 0)) max.green = set["green"];
      if (set["blue"] > (max.blue || 0)) max.blue = set["blue"];
      if (set["red"] > (max.red || 0)) max.red = set["red"];
    });
    return acc + (max.blue! * max.red! * max.green!);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
