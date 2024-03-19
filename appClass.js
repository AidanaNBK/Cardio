'use strict';

class App {
  #workouts = [];
  #map;
  #mapEvent;

  constructor() {
    // at the moment of creation will be called automatically
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    // this event listener should be outside the form event listener
    inputType.addEventListener('change', this._toggleClimbField.bind(this));
  }

  _getPosition() {
    // API geolocaton
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function (err) {
          alert('Impossible to find your current position');
          //   console.log('Error: ' + err.message);
        }
      );
    }
  }

  _loadMap(position) {
    // function successCallback(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    // using leaflet to show the map
    this.#map = L.map('map').setView(coords, 14); // .setView([coordinates], zoom value)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // event listener for the map click (method in the leaflet library)
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleClimbField() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
    inputDistance.focus();
  }

  _newWorkout(e) {
    e.preventDefault();
    // clear the input fields
    inputDistance.value = '';
    inputDuration.value = '';
    inputTemp.value = '';
    inputClimb.value = '';

    // add a marker to the map according to the coordinates
    // L.marker([lat, lng]).addTo(map).bindPopup('Training').openPopup();
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 60,
          autoClose: false, // !why not working?!?!
          className: 'running-popup',
        })
      )
      .setPopupContent('Training')
      .openPopup();

    form.classList.add('hidden');
  }
}
