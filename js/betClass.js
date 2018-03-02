// Variables
let inputOptionsDiv;
let addOption;
// Functions
function loginFinished() {
  console.log("Loggin finished");
  inputOptionsDiv = document.getElementById("inputOptionsDiv");
  addOption = document.getElementById("addOption");
  // Add click on add more options
  addOption.addEventListener("click", function() {
      // Check current amount of options
      console.log("hello?");
      if(document.querySelectorAll(".inputOption").length < 20) {
          let newOption = document.createElement("input");
          newOption.classList.add("createBetInput");
          newOption.classList.add("inputOption");
          newOption.setAttribute("placeholder", "Option");

          inputOptionsDiv.appendChild(newOption);
      } else {
        let errorBox = document.getElementById("errorBox");
        errorBox.classList.remove("hidden");
      }
  });
  // Add ripple effect to buttons
  let btns = document.querySelectorAll('.mdc-button');
  let fabs = document.querySelectorAll('.mdc-fab');
  for (let i = 0, btn; btn = btns[i]; i++) {
    mdc.ripple.MDCRipple.attachTo(btn);
  }
  for (let i = 0, fab; fab = fabs[i]; i++) {
    mdc.ripple.MDCRipple.attachTo(fab);
  }
}
function createBet(event){
  let inputs = document.querySelectorAll(".createBetInput");
  let title = inputs[0].value;
  let question = inputs[1].value;
  let coins = inputs[2].value;
  let endTime = inputs[3].value;
  let lastBetTime = inputs[4].value;
  let myNewBet = new Bet(title, question, coins, endTime, lastBetTime, userObj);

  //let options = document.querySelectorAll(".betOption");
  //let optionCount = options.length;

  // Clear inputs on submit
  inputs.forEach(function(input) {
      input.value = "";
  });
}




class Bet {
  constructor(title, question, coins, endTime, lastBetTime, creator, optionsObj) {
    this.title = title;
    this.question = question;
    this.coins = coins;
    this.endTime = endTime; // Visual time only
    this.lastBetTime = lastBetTime;
    this.creator = creator; // Get the person who created it
    this.numberOfBets = 0;// || Fetch from db
    this.options = undefined;

    const mainTag = document.getElementsByTagName('main')[0]
    const betDiv = document.createElement('div');
    betDiv.setAttribute('class', 'bet');
    betDiv.innerHTML = `<div class="bet-top">
        <img class="userImage avatar" src="${this.creator.displayImage}" alt="img" />
        <div class="inf">
          <p class="size-14 text-dark">
            ${this.title}
          </p>
          <p class="size-14 text-light">
            Created by: ${this.creator.name}
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
            <p class="text-light acme">${this.numberOfBets}</p>
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
  castVote(){

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

class User {
  constructor() {
      this.image = undefined; // Fetch image from facebook objekt
      this.name = undefined; // Fetch name from facebook objekt
      this.coins = undefined; //fetch from db || 5000;
      this.rank = undefined; // Fetch rank from database || 0;
      this.wins = undefined; // Fetch wins from database || 0;
      this.loses = undefined; // Fetch wins from database || 0;
      this.totBets = this.wins + this.loses;
      this.winPercentage = this.wins / this.totBets;
      this.bettingLimit = undefined;// Fetch bettinglimit from db || 1000;
    }
    logout() {
      // Logout the user;
    }
    remove() {
      // Logout and delete the user from db;
    }
    changeName(name) {
      if (typeof(name) != "string"  || name.length > 30 || name.length < 3) {
        alert("Your name can't be longer then 30chars nor less then 3. Do you even String ?");
      } else {
        this.name = name;
        // save to db;
      }
    }
    changeLimit(limit) {
      if (typeof(limit) != "number" || limit.length > 6 || limit.length < 2) {
        alert("Limit you must, between the length of 6 and 2 a Number should do.")
      } else {
        this.bettingLimit = limit;
        // save to db;
      }
    }
}
// let user = newUser();
