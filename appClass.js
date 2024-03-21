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

  _hideForm() {
    // clear the input fields
    inputDistance.value = '';
    inputDuration.value = '';
    inputTemp.value = '';
    inputClimb.value = '';
    // hide the form
    form.classList.add('hidden');
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

  _displayWorkout(workout, type) {
    // L.marker([lat, lng]).addTo(map).bindPopup('Training').openPopup();
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 60,
          autoClose: false, // !why not working?!?!
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type} workout`)
      .openPopup();
  }

  _addToList(workout) {}

  _newWorkout(e) {
    const areNumbers = (...numbers) =>
      numbers.every(num => Number.isFinite(num));
    const arePositive = (...numbers) => numbers.every(num => num > 0);

    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;

    // recieve values from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const time = +inputDuration.value;
    let workout;
    // determine type of the training
    if (type === 'running') {
      const temp = +inputTemp.value;
      if (
        !areNumbers(temp, distance, time) ||
        !arePositive(temp, distance, time)
      ) {
        alert('Invalid input!');
        return;
      }
      workout = new Running(distance, time, [lat, lng], temp);
    }
    if (type === 'cycling') {
      const climb = +inputClimb.value;
      if (!areNumbers(climb, distance, time) || !arePositive(distance, time)) {
        alert('Invalid input!');
        return;
      }
      workout = new Cycling(distance, time, [lat, lng], climb);
    }

    // add object to the array of workout
    this.#workouts.push(workout);
    console.log(this.#workouts);

    // show training in the map
    this._displayWorkout(workout);

    // show training in the list
    this._addToList(workout);
    // add a marker to the map according to the coordinates

    this._hideForm();
  }
}
