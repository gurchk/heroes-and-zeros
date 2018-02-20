class Bet {
  constructor(title, description, points, endTime, lastBetTime){
    this.title = title;
    this.description = description;
    this.points = points;
    this.endTime = endTime; // Visual time only
    this.lastBetTime = lastBetTime;
  }
  startTimer(seconds = this.lastBetTime, container = "") { // Add container of bet
    var now, m, s, startTime, timer, obj, ms = seconds * 1000,
      display = document.getElementById(container);
    obj = {};
    obj.resume = () => {
      startTime = new Date().getTime();
      timer = setInterval(obj.step, 250);
    };
    obj.step = () => {
      now = Math.max(0, ms - (new Date().getTime() - startTime)),
        m = Math.floor(now / 60000),
        s = Math.floor(now / 1000) % 60;
      s = (s < 10 ? "0" : "") + s;
      if (now === 0) {
        clearInterval(timer);
        obj.resume = function() {};
        this.onComplete();
      }
      return now;
    };
    obj.resume();
    return obj;
  }
  onComplete(){
    // Play some cool sound
    // Calculate the winner
    // Update some statistics
    // Set player points
    // Draw palyer points
  }
}
// let myNewBet = new Bet(title, description, points, endTime, lastBetTime);
