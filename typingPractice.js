let { stdin, stdout } = process;
stdin = stdin.setEncoding("utf8");
const chalk = require("chalk");
const rl = require("readline-sync");
const { blue, yellowBright, green, white, red } = chalk;
let colors = [blue, yellowBright, green, white, red];
let characters = [];
let initialchar = "abcdefghijklmnopqrstuvwxyzxABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

const counter = {
  correct: 0,
  totalCharTyped: 0,
  timer: new Date().valueOf()
};

const newCharMaker = function() {
  let charcterInfo = {};
  let columns = process.stdout.columns - 5;
  let multiplier = initialchar.length;
  const selectedCharIndex = Math.floor(Math.random() * multiplier);
  charcterInfo.char = initialchar[selectedCharIndex];
  charcterInfo.x = Math.floor(Math.random() * columns);
  charcterInfo.y = 2;
  charcterInfo.color = colors[Math.floor(Math.random() * 5)];
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

const gameQuiter = function() {
  stdout.cursorTo(0, 1);
  stdout.write(`SCORE :---> ${counter.correct * 5}\n\n`);
  stdout.write(`total correct answer : ${counter.correct}\n`);
  stdout.write(
    `total wrong answer : ${counter.totalCharTyped - counter.correct}\n`
  );
  stdout.write(
    `total time played : ${Math.floor(
      (new Date().valueOf() - counter.timer) / 1000
    )} seconds\n`
  );
  process.exit(0);
};

const isGameOver = function(rows) {
  characters.forEach(charInfo => {
    if (charInfo.y == rows || counter.totalCharTyped - counter.correct >= 10) {
      gameQuiter();
    }
  });
};

const envSetUp = function() {
  let rows = stdout.rows;
  printChars();
  isGameOver(rows);
  stdout.cursorTo(100, 35);
  stdout.write(
    `time : ${Math.floor(
      (new Date().valueOf() - counter.timer) / 1000
    )} seconds`
  );
  stdout.cursorTo(80, 35);
  stdout.write(`correctAns : ${counter.correct}`);
  stdout.cursorTo(60, 35);
  stdout.write(`wrongAns : ${counter.totalCharTyped - counter.correct} /10`);
  stdout.cursorTo(0, 35);
};

const wordsMaker = function() {
  if (process.argv[2] == "--c") {
    stdin.setRawMode("true");
  }
  if (process.argv[2] == "--w") {
    let words = require("./words.json");
    initialchar = words.map(element => element + "\n");
  }
};

const eraseWordOrChar = function(inputChar) {
  return function(charinfo) {
    if (inputChar == charinfo.char) {
      characters.splice(characters.indexOf(charinfo), 1);
      counter.correct += 1;
    }
    return inputChar == charinfo.char;
  };
};

const typingGame = inputChar => {
  editor = eraseWordOrChar(inputChar);
  characters.some(editor);
  counter.totalCharTyped += 1;
  if (inputChar.trim() == "?") {
    gameQuiter();
  }
};

const printInstruction = function() {
  const instruction = `Press ? to quit the game\nPress Enter: to Start the game\n`;
  rl.question(instruction);
};

const main = function() {
  wordsMaker();
  printInstruction();
  stdin.resume();
  setInterval(envSetUp, 500);
  setInterval(characterInserter, 1000);
  stdin.on("data", typingGame);
};

main();