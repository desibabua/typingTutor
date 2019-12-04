let { stdin, stdout } = process;
stdin = stdin.setEncoding("utf8");
let initialchar = "abcdefghijklmnopqrstuvwxyzx".split("").map((char)=>char+"\n")

let Characters = [
  {
    char: "a\n",
    x: 100,
    y: 2
  }
];

const newCharMaker = function() {
  let info = {};
  let columns = process.stdout.columns;
  Math.floor(Math.random() * 26);
  info.char = initialchar[Math.floor(Math.random() * 26)];
  info.x = Math.floor(Math.random() * columns);
  info.y = 2;
  return info;
};

const characterInserter = function() {
  Characters.push(newCharMaker());
};

const printChars = function() {
  process.stdout.cursorTo(0, 1);
  process.stdout.clearScreenDown();
  Characters.forEach(charinfo => {
    process.stdout.cursorTo(charinfo.x, charinfo.y);
    console.log(charinfo.char);
    charinfo.y += 1;
  });
};

const isGameOver = function(rows) {
  Characters.forEach(charInfo => {
    if (charInfo.y == rows) {
      process.exit(0);
    }
  });
};

const envSetUp = function() {
  let rows = process.stdout.rows;
  printChars();
  isGameOver(rows);
  process.stdout.cursorTo(0, 37);
};

const main = function() {
  setInterval(envSetUp, 1000);
  setInterval(characterInserter, 1500);
  stdin.on("data", inputChar => {
    Characters.forEach(charinfo => {
      if (inputChar == charinfo.char) {
        Characters.splice(Characters.indexOf(charinfo), 1);
      }
    });
  });
};

main();
