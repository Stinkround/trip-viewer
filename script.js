var map;
var tripData = [];
var polyLine;
var tripStarted = false;
var startingMarker;
var endingMarker;
var lock;

function createMap() {
  map = L.map('leaflet-map').setView(
    [38.54786611899099, -100.50853011683593],
    5
  );

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

function resetMap() {
  document.querySelector('#leaflet-map').remove();

  let newMap = document.createElement('div');
  newMap.id = 'leaflet-map';

  document.querySelector('#map').appendChild(newMap);
  tripData = [];

  createMap();
}

function start() {
  createMap();
  let startButton = document.querySelector('#start-button');
  let endButton = document.querySelector('#end-button');
  let resetButton = document.querySelector('#reset-button');
  let downloadButton = document.querySelector('#download-button');
  let reviewButton = document.querySelector('#review-button');

  reviewButton.addEventListener('click', function () {
    window.open('/trip-viewer/overview/trip.html', '_blank');
  });

  downloadButton.addEventListener('click', function () {
    console.log(polyLine);
    const object = polyLine.toGeoJSON();

    object.properties.created = new Date().getTime();
    object.properties.start = [
      startingMarker.getLatLng().lat,
      startingMarker.getLatLng().lng,
    ];
    object.properties.end = [
      endingMarker.getLatLng().lat,
      endingMarker.getLatLng().lng,
    ];

    const objectData = JSON.stringify(object);

    const blob = new Blob([objectData], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-trip.geojson'; // Set the filename

    // Append the link to the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  resetButton.addEventListener('click', function () {
    resetMap();
    document.querySelector('#after').style = 'display: none;';
  });

  endButton.addEventListener('click', function () {
    if (!tripStarted) {
      alert("You cannot end a trip that hasn't started yet.");
    } else {
      if (confirm('Are you sure you want to end the trip?')) {
        alert('Ending trip, this might take a moment');
        lock = true;
        navigator.geolocation.getCurrentPosition((position) => {
          tripStarted = false;
          let location = [position.coords.latitude, position.coords.longitude];

          console.log(location);
          endingMarker = L.marker(location).addTo(map);
          endingMarker.bindPopup('Ending Position');

          document.querySelector('#after').style = '';
        });
      }
    }
  });

  startButton.addEventListener('click', function () {
    navigator.geolocation.watchPosition(success, error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  start();
});

function error(err) {
  if (err.code === 1) {
    alert('Please allow geolocation to start the trip');
  } else {
    alert('Error getting geolocation');
  }
}

function success(location) {
  const position = [location.coords.latitude, location.coords.longitude];
  if (!tripStarted) {
    tripStarted = !tripStarted;

    map.setView(position, 14);

    console.log(position);
    console.log(tripStarted);

    startingMarker = L.marker(position).addTo(map);
    startingMarker.bindPopup('Starting Location');
  } else {
    if (!lock) {
      tripData.push(position);
      updateLine();
    }
  }
}

function updateLine() {
  polyLine = L.polyline(tripData, { color: 'purple', weight: 5 }).addTo(map);
}
