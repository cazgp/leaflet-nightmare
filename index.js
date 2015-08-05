var fs = require('fs');
var util = require('util');
var path = require('path');
var Nightmare = require('nightmare');

var leafletJs = [__dirname + '/src/leaflet.js'];
var leafletCss = [__dirname + '/src/leaflet.css'];
var jsFormat = '<script src="%s"></script>';
var cssFormat = '<link rel="stylesheet" href="%s" />';

var rUrl = new RegExp('^(?:[a-z]+:)?//', 'i');

var getTags = function(staticDir, always, vals, format) {
  return always.concat(vals || []).map(function(v) {
    // If not dealing with URL, we may have to adjust the value.
    if(!rUrl.test(v) && !path.isAbsolute(v)) {
      v = util.format('%s/%s.js', staticDir, v);
    }
    return util.format(format, v);
  }).join('');
};

var getScripts = function(options) {
  return getTags(options.static_dir, leafletJs, options.scripts, jsFormat);
};

var getStyles = function(options) {
  return getTags(options.static_dir, leafletCss, options.styles, cssFormat);
};

var initLeaflet = function(options, cb) {
  var doc = '<html><head>%s%s</head><body><div id="map" style="width: 500px; height: 500px"></div></body></html>';
  var scripts = getScripts(options);
  var styles = getStyles(options);

  var tmpOut = '/tmp/leaflet-nightmare-' + Date.now() + '.html';
  fs.writeFile(tmpOut, util.format(doc, styles, scripts), function(err) {
    if(err) {
      throw new Error('There was an error in writing tmp file: ', err);
    }
    cb(null, tmpOut)
  });
};

// Wraps a function which runs in the context of Leaflet.
var evaluator = function(file) {
  return new Function(file);
};

module.exports = function(output, options, cb) {
  var fn;
  if(!output) {
    throw new Error('Output file must be defined');
  }

  if(typeof cb !== 'function') {
    throw new Error('Callback must be defined');
  }

  if(!options) {
    throw new Error('Options must be defined');
  }

  initLeaflet(options, function(err, tmpfile) {
    new Nightmare()
      .goto('file://' + tmpfile)
      .evaluate(evaluator(options.content))
      .wait(options.wait || 1000)
      .screenshot(output)
      .run(cb);
  });
};
