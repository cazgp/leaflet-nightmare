var fs = require('fs');
var util = require('util');
var Nightmare = require('nightmare');

var leafletJs = [__dirname + '/src/leaflet.js'];
var leafletCss = [__dirname + '/src/leaflet.css'];
var jsFormat = '<script src="%s"></script>';
var cssFormat = '<link rel="stylesheet" href="%s" />';

var getTags = function(always, vals, format) {
  return always.concat(vals || []).map(function(v) {
    return util.format(format, v);
  }).join('');
};

var initLeaflet = function(options, cb) {
  var doc = '<html><head>%s%s</head><body><div id="map" style="width: 500px; height: 500px"></div></body></html>';
  var scripts = getTags(leafletJs, options.scripts, jsFormat);
  var styles = getTags(leafletCss, options.scripts, cssFormat);

  var tmpOut = '/tmp/leaflet-nightmare-' + Date.now() + '.html';
  fs.writeFile(tmpOut, util.format(doc, styles, scripts), function(err) {
    if(err) {
      throw new Error('There was an error in writing tmp file: ', err);
    }
    cb(null, tmpOut)
  });
};

// Runs in the context of the web page.
var evaluateLeaflet = function(options) {
  // TODO - remove hard-coded crs.
  var crs = new L.Proj.CRS(
      'EPSG:2193',
      '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m', {
          origin: [1565000, 6150000],
          resolutions: [
              '264.583862501058',
              '201.083735500804',
              '132.291931250529',
              '66.1459656252646',
              '26.4583862501058',
              '13.2291931250529',
              '6.61459656252646',
              '3.96875793751588',
              '2.11667090000847',
              '1.32291931250529',
              '0.661459656252646',
              '0.264583862501058',
              '0.132291931250529',
          ]
      }
  );

  var tileLayer = new L.TileLayer(
      'http://maps.aucklandcouncil.govt.nz/ArcGIS/rest/services/BaseMap/MapServer/tile/{z}/{y}/{x}', {
          minZoom: 0,
          maxZoom: 12,
          continuousWorld: true,
      }
  );

  // TODO improve these options.
  var map = L.map('map', {
    center: new L.LatLng(options.center.lat, options.center.lng),
    zoom: options.zoom,
    crs: crs
  });

  // Each layer in format [name, url, options].
  var oLayers = options.layers;
  for(var l=0; l<oLayers.length;l++) {
    var layer = oLayers[l];
    var name = layer[0];
    var url = layer[1];
    var opts = layer[2];
    (new L[name](url, opts)).addTo(map);
  }

};

module.exports = function(output /*args*/) {
  var fn;
  if(!output) {
    throw new Error('Output file must be defined');
  }

  var cb = arguments[arguments.length - 1];
  if(typeof cb !== 'function') {
    throw new Error('Callback must be defined');
  }

  var options = arguments[1];

  var to = typeof options;
  if(to === 'object') {
    fn = initLeaflet;
    evaluator = evaluateLeaflet;
  } else if(to === 'string') {
    // TODO implement
    // Leaflet stuff is defined in a js file somewhere.
  } else {
    throw new Error('Options must be defined');
  }

  fn(options, function(err, tmpfile) {
    new Nightmare()
      .goto('file://' + tmpfile)
      .evaluate(evaluator, function() {
      }, options)
      .wait(500)
      .screenshot(output)
      .run(cb);
  });

};
