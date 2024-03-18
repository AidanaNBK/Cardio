'use strict';

/* 
Before start of the project: 
1. users' story 
2. features
3. Block-schemes
4. Code architecture
*/

// API geolocaton
function errorCallback(err) {
  alert('Impossible to find your current position');
  console.log('Error: ' + err.message);
}
function successCallback(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  const coords = [latitude, longitude];
  // using leaflet to show the map
  const map = L.map('map').setView(coords, 14);
  // coordinated, zoom value
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //   L.marker(coords)
  //     .addTo(map)
  //     .bindPopup('First point in the map <br> Alem')
  //     .openPopup();
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}
