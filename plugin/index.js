var fs = require('fs');
var Comb = require('csscomb');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var cssCombFile = process.argv[3];
var cssCombFileGlobal = getUserHome() + "/.csscomb.json";

if (fs.existsSync(cssCombFile)) {
  var config = require(cssCombFile);
  var comb = new Comb(config);
} else if (fs.existsSync(cssCombFileGlobal)) {
  var config = require(cssCombFileGlobal);
  var comb = new Comb(config);
} else {
  var comb = new Comb('yandex');
}

process.stdin.setEncoding('utf8');

var contentChunks = [];
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  contentChunks.push(chunk);
});

process.stdin.on('end', function() {
  var syntax = process.argv[2];
  var output = comb.processString(contentChunks.join(), { syntax: syntax });
  if (output) {
    console.log(output);
    process.exit(0);
  } else {
    process.exit(1);
  }
});
