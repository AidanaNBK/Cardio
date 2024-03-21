'use strict';

class App {
  #workouts = [];
  #map;
  #mapEvent;

  constructor() {
    // at the moment of creation will be called automatically
    this._getPosition();
    this._getLocalStorageData();
    form.addEventListener('submit', this._newWorkout.bind(this));
    // this event listener should be outside the form event listener
    inputType.addEventListener('change', this._toggleClimbField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToWorkout.bind(this));
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

    // due to the fact of async in js, should be done after loading map
    this.#workouts.forEach(w => this._displayWorkout(w));
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

  _displayWorkout(workout) {
    // L.marker([lat, lng]).addTo(map).bindPopup('Training').openPopup();
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 60,
          // autoClose: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type} workout`)
      .openPopup();
  }

  _addToList(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${workout.icon}</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;
    if (workout.type === 'running') {
      html += `<div class="workout__details">
                <span class="workout__icon">📏</span>
                <span class="workout__value">${workout.pace.toFixed(2)}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">👟</span>
                <span class="workout__value">${workout.temp.toFixed(2)}</span>
                <span class="workout__unit">steps/min</span>
              </div>
            </li>`;
    } else {
      html += `<div class="workout__details">
                <span class="workout__icon">📏</span>
                <span class="workout__value">${workout.speed.toFixed(2)}</span>
                <span class="workout__unit">km/hr</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">🏔</span>
                <span class="workout__value">${workout.climb.toFixed(2)}</span>
                <span class="workout__unit">meters</span>
              </div>
            </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }

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

    // show training in the map
    this._displayWorkout(workout);

    // show training in the list
    this._addToList(workout);
    // add a marker to the map according to the coordinates

    this._hideForm();

    this._addToLocal();
  }

  _moveToWorkout(e) {
    let elem = e.target.closest('.workout');
    if (!elem) {
      return;
    }
    // console.log(elem.dataset.id);
    const workout = this.#workouts.find(
      workout => workout.id === elem.dataset.id
    );
    this.#map.setView(workout.coords, 14, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _addToLocal() {
    // only to small amount of data
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorageData() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(w => this._addToList(w));
  }
}
