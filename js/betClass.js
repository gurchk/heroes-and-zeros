
class Bet {
  constructor(title, description, points, endTime, lastBetTime, optionsObj){
    this.title = title;
    this.description = description;
    this.points = points;
    this.endTi = endTime; // Visual time only
    this.lastBetTime = lastBetTime;
    this.creator = null; // Get the person who created it
    this.options = optionsObj
  }
  startTimer(seconds = this.lastBetTime, container = "") { // Add container of bet time
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
  join(){
    // Joins the bet, deposits credits...
    // Once joined one cannot simply leav.
  }
  remove(){
    // Removes the whole bet and returns bettings.
    // Cant be done after lastBetTime is set.
  }
  onComplete(){
    // Play some cool sound
    // var audio = new Audio('audio_file.mp3');
    // audio.play();

    // Calculate the winner
    // Update some statistics
    // Set player points
    // Draw player points
  }
}
// let myNewBet = new Bet(title, description, points, endTime, lastBetTime, optionsObj);
console.log("Loaded");
