'use strict';
class Workout {
  date = new Date();
  // better to use specific library for the id creation
  id = (new Date() + '').slice(-10);
  constructor(distance, duration, coords) {
    this.distance = distance; //km
    this.duration = duration; //min
    this.coords = coords;
  }
  _setDescription() {
    if (this.type === 'running') {
      this.description = `Running ${new Intl.DateTimeFormat('en-En').format(
        this.date
      )}`;
    } else {
      this.description = `Cycling ${this.date}`;
    }
  }
}

class Running extends Workout {
  type = 'running';
  icon = '🏃';
  constructor(distance, duration, coords, temp) {
    super(distance, duration, coords);
    this.temp = temp;
    this.calculatePace();
    this._setDescription();
  }
  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  icon = '🚵‍♂️';
  constructor(distance, duration, coords, climb) {
    super(distance, duration, coords);
    this.climb = climb;
    this.calculateSpeed();
    this._setDescription();
  }
  calculateSpeed() {
    this.speed = this.distance / this.duration / 60;
  }
}
