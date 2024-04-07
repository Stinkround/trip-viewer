var map;
var polyLine;
var startingMarker;
var endingMarker;

document.addEventListener('DOMContentLoaded', function () {
  var uploadArea = document.getElementById('uploadArea');
  var uploadButton = document.getElementById('uploadButton');
  var fileInput = document.getElementById('fileInput');

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f3f3f3';
  });

  uploadArea.addEventListener('dragleave', function (e) {
    uploadArea.style.backgroundColor = '#fff';
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#fff';
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var contents = e.target.result;

      createMap(contents);
    };

    reader.readAsText(file);
  });

  uploadButton.addEventListener('click', function () {
    fileInput.click();
  });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var contents = e.target.result;

      createMap(contents);
      // You can now handle the contents of the file here
    };

    reader.readAsText(file);
  });
});

function createMap(json) {
  let polyJSON = JSON.parse(json);

  let mapContainer = document.querySelector('.map-container');
  let input = document.querySelector('.input');

  mapContainer.style = '';
  input.style = 'display: none;';

  map = L.map('leaflet-map').setView([0, 0], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let coordinates = polyJSON.geometry.coordinates.map((coord) => [
    coord[1],
    coord[0],
  ]);

  polyLine = L.polyline(coordinates, {
    color: 'purple',
    weight: 10,
  }).addTo(map);

  polyLine.bindPopup('Your Trip');

  let center = polyLine.getCenter();

  map.setView([center.lat, center.lng], 15);

  if (polyJSON.properties.start) {
    startingMarker = L.marker(polyJSON.properties.start).addTo(map);
    startingMarker.bindPopup('Starting Position');
  }

  if (polyJSON.properties.end) {
    endingMarker = L.marker(polyJSON.properties.end).addTo(map);
    endingMarker.bindPopup('End Position');
  }
}
