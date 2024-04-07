var map;
var tripData = [];
var polyLine;
var tripStarted = false;
var startingMarker;
var endingMarker;

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
  if (startingMarker) {
    map.removeLayer(startingMarker);
  }

  if (endingMarker) {
    map.removeLayer(endingMarker);
  }

  if (polyLine) {
    map.removeLayer(polyLine);
  }

  map.setView([38.54786611899099, -100.50853011683593], 5);
}

function start() {
  createMap();
  let startButton = document.querySelector('#start-button');
  let endButton = document.querySelector('#end-button');
  let resetButton = document.querySelector('#reset-button');
  let downloadButton = document.querySelector('#download-button');

  downloadButton.addEventListener('click', function () {
    const object = polyLine.toGeoJSON();

    const objectData = JSON.stringify(object);

    const blob = new Blob([objectData], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-trip.txt'; // Set the filename

    // Append the link to the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  resetButton.addEventListener('click', function () {
    resetMap();
    document.querySelector('#reset').style = 'display: none;';
  });

  endButton.addEventListener('click', function () {
    if (!tripStarted) {
      alert("You cannot end a trip that hasn't started yet.");
    } else {
      if (confirm('Are you sure you want to end the trip?')) {
        navigator.geolocation.getCurrentPosition((position) => {
          let location = [position.coords.latitude, position.coords.longitude];

          console.log(location);
          endingMarker = L.marker(location).addTo(map);
          endingMarker.bindPopup('Ending Position');

          document.querySelector('#reset').style = '';
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
    tripData.push(position);
    updateLine();
  }
}

function updateLine() {
  polyLine = L.polyline(tripData, { color: 'purple', weight: 5 }).addTo(map);
}
