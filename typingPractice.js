let { stdin, stdout } = process;
stdin = stdin.setEncoding("utf8");
let words = require("./words.json");
let initialchar = "abcdefghijklmnopqrstuvwxyzx".split("");
const chalk = require("chalk");

const { blue, yellowBright, green, white, red } = chalk;

let colors = [blue, yellowBright, green, white, red];
let characters = [];

const newCharMaker = function() {
  let charcterInfo = {};
  let columns = process.stdout.columns - 5;
  let multiplier = initialchar.length;
  const selectedColumn = Math.floor(Math.random() * multiplier);
  charcterInfo.char = initialchar[selectedColumn];
  charcterInfo.x = Math.floor(Math.random() * columns);
  charcterInfo.y = 2;
  charcterInfo.color = colors[Math.floor(Math.random()*5)]
  return charcterInfo;
};

const characterInserter = function() {
  characters.push(newCharMaker());
};

const printChars = function() {
  stdout.cursorTo(0, 1);
  stdout.clearScreenDown();
  characters.forEach(charinfo => {
    stdout.cursorTo(charinfo.x, charinfo.y);
    console.log(charinfo.color(charinfo.char));
    charinfo.y += 1;
  });
};

const isGameOver = function(rows) {
  characters.forEach(charInfo => {
    if (charInfo.y == rows) {
      process.exit(0);
    }
  });
};

const envSetUp = function() {
  let rows = stdout.rows;
  printChars();
  isGameOver(rows);
  stdout.cursorTo(0, 35);
};

const wordsMaker = function() {
  if (process.argv[2] == "--c") {
    stdin.setRawMode("true");
  }
  if (process.argv[2] == "--w") {
    initialchar = initialchar.concat(words);
    initialchar = initialchar.map(element => element + "\n");
  }
};

const main = function() {
  wordsMaker();
  setInterval(envSetUp, 500);
  setInterval(characterInserter, 1000);
  stdin.on("data", inputChar => {
    characters.forEach(charinfo => {
      if (inputChar == charinfo.char) {
        characters.splice(characters.indexOf(charinfo), 1);
      }
    });
  });
};

main();
