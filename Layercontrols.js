var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
});

var openTopoMap = L.tileLayer(
  'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
  }
);

var osmHOT = L.tileLayer(
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France',
  }
);

var baseMaps = {
  OpenStreetMap: osm,
  'OpenStreetMap.HOT': osmHOT,
  OpenTopoMap: openTopoMap,
};

var layerControls = {
  layers: ['OpenStreetMap', 'OpenStreetMap.HOT', 'OpenTopoMap'],

  default: 'OpenStreetMap.HOT',

  addDefault: function (map) {
    var defaultLayer = layerControls.default;

    baseMaps[defaultLayer].addTo(map);
  },

  getDefault: function () {
    return layerControls.default;
  },

  changeDefault: function (layer, apply, map) {
    layerControls.default = layer;

    if (apply) {
      layerControls.changeLayer(map, layerControls.default);
    }
  },

  changeLayer: function (map, layer) {
    if (map.hasLayer(osm)) {
      map.removeLayer(osm);
    }

    // Check if OpenTopoMap layer is active
    if (map.hasLayer(openTopoMap)) {
      map.removeLayer(openTopoMap);
    }

    // Check if OSM HOT layer is active
    if (map.hasLayer(osmHOT)) {
      map.removeLayer(osmHOT);
    }

    baseMaps[layer].addTo(map);
  },

  addLayers: function (map) {
    var layerControl = L.control.layers(baseMaps).addTo(map);
  },
};

export { layerControls };
