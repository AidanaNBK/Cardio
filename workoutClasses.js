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
}

class Running extends Workout {
  type = 'running';
  constructor(distance, duration, coords, temp) {
    super(distance, duration, coords);
    this.temp = temp;
    this.calculatePace();
  }
  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(distance, duration, coords, climb) {
    super(distance, duration, coords);
    this.climb = climb;
    this.calculateSpeed();
  }
  calculateSpeed() {
    this.speed = this.distance / this.duration / 60;
  }
}
