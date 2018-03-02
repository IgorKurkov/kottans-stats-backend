var fs = require('fs');

if(!process.env.GITTER_KEY) {
  var keys = JSON.parse(fs.readFileSync('api/keys.json', 'utf8'));
}

exports.vars = {
  gitterToken:    process.env.GITTER_KEY     || keys.gitterToken,
  adminpasstoken: process.env.ADMINPASSTOKEN || keys.adminPassToken,
  hash: "7e16b5527c77ea58bac36dddda6f5b444f32e81b",
  defaultIntervalTime: 1700000,
  lessonsRegex: /Website Performance|server and http tools|CSS Basics|HTML5 and CSS|Object Oriented JS|Intro to JS|Offline Web|Pair Game|Intro to HTML & CSS|task 2|Task 1\D|Task 1\d|Web Design/ig,
}
