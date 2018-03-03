// Variables
let inputOptionsDiv;
let addOption;

function createBet(event) {
    let inputs = document.querySelectorAll(".createBetInput");
    let title = inputs[0];
    let question = inputs[1];
    let betAmount = inputs[2];
    let endTime = inputs[3];
    let lastBetTime = inputs[4];

    let optionsDiv = document.getElementById("inputOptionsDiv");
    let options = document.querySelectorAll(".inputOption");
    let optionValues = [];
    let optionCount = 0;

    options.forEach( option => {
        if(option.value) {
            optionValues.push({name: option.value});
            optionCount++;
        }
    });

    let error = false;

    //check for errors in input fields
    if(optionCount < 2) {
        document.getElementById("optionsError").classList.remove("hidden");
        error = true;
    }

    if(!title.value) {
        if(!title.nextElementSibling.className.includes("error")) {
            title.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
        }
        error = true;
    }

    if(!question.value) {
        if(!question.nextElementSibling.className.includes("error")) {
            question.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
        }
        error = true;
    }

    if(!betAmount.value) {
        if(!betAmount.nextElementSibling.className.includes("error")) {
            betAmount.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
        }
        error = true;
    }

    if(!endTime.value) {
        if(!endTime.nextElementSibling.className.includes("error")) {
            endTime.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
        }
        error = true;
    }

    if(!lastBetTime.value) {
        if(!lastBetTime.nextElementSibling.className.includes("error")) {
            lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
        }
        error = true;
    }

    if(!error) {
        let errors = document.getElementsByClassName("error");
        while(errors.length > 0) {
            errors[errors.length-1].parentNode.removeChild(errors[errors.length-1]);
        }

        //document.getElementById("optionsError").classList.add("hidden");

        // Add bet to database
        let data = {
            title: title.value,
            question: question.value,
            betAmount: betAmount.value,
            endTime: endTime.value,
            lastBetTime: lastBetTime.value,
            creator: userObj,
            active: true,
            numberOfBets: 0,
            winningOption: "",
            pot: 0
        }

        // TODO: Bettet skapas innan options hinner läggas in eftersom child_added händer direkt. Testa lägga in child_changed också och reloada
        // betten då, då får den med options också.
        db.ref("bets/").push(data).then( snap => {
            let betKey = snap.key;
            optionValues.forEach(option => {
                db.ref("bets/" + betKey + "/options/").push(option);
            });
        });

        // Clear inputs on submit
        inputs.forEach(function(input) {
          input.value = "";
        });
    }
}

class Bet {
  constructor(betId, title, question, coins, endTime, lastBetTime, creator, numberOfBets, options) {
    this.betId = betId;
    this.title = title;
    this.question = question;
    this.coins = coins;
    this.endTime = endTime;
    this.lastBetTime = lastBetTime;
    this.creator = creator;
    this.numberOfBets = numberOfBets;
    this.options = options;
    this.card = undefined;
  }
  createCard() {
    const mainTag = document.getElementsByTagName('main')[0];
    this.card = document.createElement("div");
    this.card.setAttribute('class', 'bet');
    this.card.innerHTML = `
        <div class="bet-top">
            <img class="userImage avatar" src="${this.creator.displayImage}" alt="img" />
            <div class="inf">
                <p class="size-14 text-dark">${this.title}</p>
                <p class="size-14 text-light">Created by: ${this.creator.name}</p>
            </div>
            <p class="size-14 text-light">End date: ${this.endTime}</p>
        </div>`;
      
    let div = document.createElement("div");
    div.classList.add("bet-middle");

    this.createOptions(div);
    this.card.insertAdjacentElement("beforeend", div);

    this.card.insertAdjacentHTML("beforeend", `
        <div class="bet-bottom">
        <div class="inf">
            <h1 class="size-24 text-dark">${this.question}</h1>
            <div class="relative-wrapper coin-wrapper">
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
                <button class="mdc-button voteBtn mdc-ripple-upgraded" disabled>Vote</button>
                <button class="mdc-button mdc-ripple-upgraded shareBtn">Share</button>
            </div>
            <p class="size-14 text-light">Betting closes in: ${this.last}</p>
        </div>`);
    mainTag.appendChild(this.card);

    let shareButton = this.card.children[2].children[2].children[1];
    shareButton.addEventListener("click", event => {
        this.shareBet();
    });
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
  join(selectedOption) {
    // Joins the bet, deposits credits...
    // Once joined one cannot simply leave.
    let userCoins = userObj.coins;

    if(userCoins < this.betAmount) {
        // TODO: Display some kind of error message to the user.
    }
    else {
        this.pot += this.betAmount;
        userCoins 
    }
  }
  remove() {
    // Removes the whole bet and returns bettings.
    // Cant be done after lastBetTime is set.
  }
  castVote() {
    //Find the checked option
    //let votedOption = document.getElementsByClassName
    console.log("To be implemented.");
    // TODO: Grab the current activated input from the Bet and join() bet.
  }
    createOptions(container) {
        let numberOfOptions = 1;
        let html = [];
        for (let option in this.options) {
            let evenOrOdd;
            if((numberOfOptions%2)==0)
            evenOrOdd = "evenOption";
            else
            evenOrOdd = "oddOption";

            let label = document.createElement("label");
            label.setAttribute("for", option);

            let input = document.createElement("input");
            input.classList.add("radioOption");
            input.setAttribute("name", this.title);
            input.setAttribute("type", "radio");
            input.id = option;

            let div = document.createElement("div");
            div.classList.add("alternative", evenOrOdd);

            let span = document.createElement("span");
            span.classList.add("size-24", "text-dark", "w700");
            span.innerHTML = numberOfOptions;

            let p = document.createElement("p");
            p.classList.add("size-14", "text-dark");
            p.innerHTML = this.options[option].name;

            input.addEventListener("click", (event) => {
                this.enableVoteButton();
            });

            div.appendChild(span);
            div.appendChild(p);
            label.appendChild(input);
            label.appendChild(div);

            container.appendChild(label);

            numberOfOptions++
        }

        return container;
    }
    enableVoteButton() {
        let voteButton = this.card.querySelectorAll("button")[0];
        voteButton.disabled = false;

        voteButton.addEventListener("click", () => {
            this.castVote();
        });
    }
    shareBet() {
        // Integrate with Facebook API or another API to share the bet.
        console.log("To be implemented.");
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
// let myNewBet = new Bet(title, question, coins, endTime, lastBetTime, options);
