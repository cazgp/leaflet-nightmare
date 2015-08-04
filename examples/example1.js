nl = require('../index');

nl(__dirname + '/example1.png', {
  scripts: [
    __dirname + '/proj4.js',
    __dirname + '/proj4leaflet.js',
  ],
  layers: [[
    'TileLayer',
    'http://maps.aucklandcouncil.govt.nz/ArcGIS/rest/services/BaseMap/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 0,
        maxZoom: 12,
        continuousWorld: true,
    }],
  ],
  center: {
    lat: -36.8484597,
    lng: 174.76333150000005
  },
  zoom: 8
}, function(err, out) {
  if(err) {
    throw new Error("whoopsy nightmare: ", err);
  }
});
