window.addEventListener('load', function() {
  let btns = document.querySelectorAll('.mdc-button');
  let fabs = document.querySelectorAll('.mdc-fab');
  for (let i = 0, btn; btn = btns[i]; i++) {
    mdc.ripple.MDCRipple.attachTo(btn);
  }
  for (let i = 0, btn; btn = fabs[i]; i++) {
    mdc.ripple.MDCRipple.attachTo(btn);
  }

  let bet_middle = document.querySelectorAll('.bet-middle');
  bet_middle.forEach(function(children) {
    console.log(children);
  });
  fabs.forEach(function(fab){
    fab.addEventListener('click', event => {
      //console.log(event.target);
      //event.target.offsetParent.setAttribute('class', 'alternative selected');
    })
  });
});

class Bet {
  constructor(title, question, coins, endTime, lastBetTime, optionsObj) {
    this.title = title;
    this.question = question;
    this.coins = coins;
    this.endTime = endTime; // Visual time only
    this.lastBetTime = lastBetTime;
    this.creator = null; // Get the person who created it
    this.bettingPeople = 0;// || Fetch from db
    this.options = optionsObj;

    const mainTag = document.getElementsByTagName('main')[0]
    const betDiv = document.createElement('div');
    betDiv.setAttribute('class', 'bet');
    betDiv.innerHTML = `<div class="bet-top">
        <img src="" alt="img" />
        <div class="inf">
          <p class="size-14 text-dark">
            ${this.title}
          </p>
          <p class="size-14 text-light">
            Created by: ${this.creator}
          </p>
        </div>
        <p class="size-14 text-light">
          End date: ${this.endTime}
        </p>
      </div>
      <div class="bet-middle">`;
    for (let option in this.options) {
      let numberOfOptions = 1;
      betDiv.innerHTML += `<label for="${option}">
        <input class="radioOption" type="radio" name="${this.title}" id="${option}">
          <div class="alternative">          
            <span class="size-24 text-dark w700">${numberOfOptions}</span>
            <p class="size-14 text-dark">${this.options[option].name}</p> <!-- mdc-fab--exited for hidden -->
            <button class="mdc-fab material-icons mdc-fab--mini" aria-label="Favorite">
              <span class="mdc-fab__icon">add</span>
            </button>
          </div>
        </label>`
      numberOfOptions++;
    }
    betDiv.innerHTML += `</div>
      <div class="bet-bottom">
        <div class="inf">
          <h1 class="size-24 text-dark">${this.question}</h1>
          <div class="relative-wrapper">
            <p class="text-light acme">${this.coins}</p>
            <i class="material-icons">high_quality</i>
          </div>
        </div>
        <div class="peeps">
          <div class="relative-wrapper">
            <p class="text-light acme">${this.bettingPeople}</p>
            <i class="material-icons">people</i>
          </div>
        </div>
        <div class="buts">
          <button class="mdc-button" disabled>
            Vote
          </button>
          <button class="mdc-button mdc-ripple-upgraded">
            Share
          </button>
        </div>
        <p class="size-14 text-light">
          Betting closes in: ${this.last}
        </p>
      </div>`
    mainTag.appendChild(betDiv);
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
  join() {
    // Joins the bet, deposits credits...
    // Once joined one cannot simply leav.
  }
  remove() {
    // Removes the whole bet and returns bettings.
    // Cant be done after lastBetTime is set.
  }
  onComplete() {
    // Play some cool sound
    // var audio = new Audio('audio_file.mp3');
    // audio.play();

    // Calculate the winner
    // Update some statistics
    // Set player coins
    // Draw player coins
  }
}
// let myNewBet = new Bet(title, question, coins, endTime, lastBetTime, optionsObj);
console.log("Loaded");
