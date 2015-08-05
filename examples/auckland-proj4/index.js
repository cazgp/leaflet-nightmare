fs = require('fs');
nl = require('../../index');

nl(__dirname + '/auckland-proj4.png', {
  scripts: [
    __dirname + '/proj4.js',
    __dirname + '/proj4leaflet.js',
  ],
  content: fs.readFileSync(__dirname + '/script.js')
}, function(err, out) {
  if(err) {
    throw new Error("whoopsy nightmare: ", err);
  }
});
