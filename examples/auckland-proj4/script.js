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

var map = L.map('map', {
    center: new L.LatLng(-36.8484597, 174.76333150000005),
    zoom: 8,
    crs: crs,
    zoomControl: false
});

(new L.TileLayer(
    'http://maps.aucklandcouncil.govt.nz/ArcGIS/rest/services/BaseMap/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 0,
        maxZoom: 12,
        continuousWorld: true,
    }
)).addTo(map);
