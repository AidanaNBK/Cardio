'use strict';
let id = 0;
class Workout {
  constructor(distance, duration, coords) {
    this.id = id++;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.date = new Date();
  }
}

class Running extends Workout {
  constructor(distance, duration, coords, temp, pace) {
    super(distance, duration, coords);
    this.temp = temp;
    this.pace = pace;
  }
}

class Cycling extends Workout {
  constructor(distance, duration, coords, climb, speed) {
    super(distance, duration, coords);
    this.climb = climb;
    this.speed = speed;
  }
}
