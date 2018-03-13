const bets = {};

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

    //CHECK THAT LAST BET TIME OCCUR BEFORE BET END TIME
	if (lastBetTime.value > endTime.value) {
        if(!lastBetTime.nextElementSibling.className.includes("error")) {
            lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*Betting must close before the bet ends.</p>");
        }
		error = true;
	}

	//CREATE A DATE STRING IN THE SAME FORMAT AS INPUT FIELDS
	let d = new Date();
	let date;
	date = d.getFullYear();
	(d.getMonth() + 1) < 10 ? date += "-0" + (d.getMonth() + 1) : date += "-" + (d.getMonth() + 1);
	d.getDate() < 10 ? date += "-0" + d.getDate() : date += "-" + d.getDate();

	//CHECK THAT LAST BET TIME AND BET END TIME IS AFTER TODAYS DATE
	if (lastBetTime.value < date || endTime.value < date) {
        if(!lastBetTime.nextElementSibling.className.includes("error")) {
            lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*That date has already passed.</p>");
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
            creator: {
                uid: user.get("uid"),
                displayImage: user.get("displayImage"),
                name: user.get("name")
            },
            active: true,
            numberOfBets: 0,
            winningOption: "",
            pot: 0,
            numberOfOptions: optionCount
        }

        db.ref("bets/").push(data).then( snap => {
            let betKey = snap.key;

            db.ref("bets/" + betKey).on("child_changed", snapshot => {
                let data = snapshot.val();
                if(Object.keys(data).length === optionCount) {
                    db.ref("bets/" + betKey).once("value", snapshot => {
                        let data = snapshot.val();
                        let bet = new Bet(
                            betKey,
                            data.title,
                            data.question,
                            data.betAmount,
                            data.endTime,
                            data.lastBetTime,
                            data.creator,
                            data.numberOfBets,
                            data.options,
                            data.numberOfOptions,
                            data.winningOption,
                            data.pot
                        );
                        bet.createCard();
                        bets[betKey] = bet;
                    });
                }
            });

            optionValues.forEach(option => {
                db.ref("bets/" + betKey + "/options/").push(option);
            });
        });

        // Clear inputs on submit
        inputs.forEach(function(input) {
          input.value = "";
        });

        // Hide the create bet window
        fadeOut(document.getElementById("createBet"), "block");
        fadeOut(document.getElementById("createBetCover"));
        fetchBetsFromDB();
    }
}

class Bet {
    constructor(id, title, question, betAmount, endTime, lastBetTime, creator, numberOfBets, options, numberOfOptions, winningOption, pot) {
        this.id = id;
        this.title = title;
        this.question = question;
        this.betAmount = betAmount;
        this.endTime = endTime;
        this.lastBetTime = lastBetTime;
        this.creator = creator;
        this.numberOfBets = numberOfBets;
        this.options = options;
        this.numberOfOptions = numberOfOptions;
        this.card = undefined;
        this.grid = document.getElementsByClassName("grid")[0];
        this.winningOption = winningOption;
        this.pot = pot;
		this.placedBets = {};
    }
    createCard() {
        // Create the bet card and all its components, add their classes etc.
        this.card = document.createElement("div");
        this.card.classList.add("bet");
        this.card.setAttribute("data-id", this.id);

        let betTop = document.createElement("div");
        betTop.classList.add("bet-top");

        let avatar = document.createElement("img");
        avatar.classList.add("userImage", "avatar");
        avatar.setAttribute("src", this.creator.displayImage);
        avatar.setAttribute("alt", this.creator.name);
        avatar.addEventListener("click", () => {
            console.log("Redirect to userpage, TODO");
        });

        let topInfo = document.createElement("div");
        topInfo.classList.add("inf");
        let betTitle = document.createElement("p");
        betTitle.classList.add("size-14", "text-dark");
        betTitle.innerText = this.title;

        let createdBy = document.createElement("p")
        createdBy.classList.add("size-14", "text-light");
        createdBy.innerText = "Created by: " + this.creator.name;
        createdBy.addEventListener("click", () => {
            console.log("Redirect to userpage, TODO");
        });

        let endDate = document.createElement("p");
        endDate.classList.add("size-14", "text-light");
        endDate.innerText = "End date: " + this.endTime;

        // If there's no winning option and the bet has ended, add winner selection text
        if(!this.winningOption && setTimeNow() > new Date(this.endTime).getTime()) {
            endDate.innerText = "Awaiting winner selection";
            endDate.style.color = "#ff5d55";
        }

        topInfo.appendChild(betTitle);
        topInfo.appendChild(createdBy);

        betTop.appendChild(avatar);
        betTop.appendChild(topInfo);
        betTop.appendChild(endDate);

        let betMiddle = document.createElement("div");
        betMiddle.classList.add("bet-middle");

        // Add all the options to the bet-middle div.
        this.createOptionsIn(betMiddle);

        let betBottom = document.createElement("div");
        betBottom.classList.add("bet-bottom");

        let bottomInfo = document.createElement("div");
        bottomInfo.classList.add("inf");
        let questionText = document.createElement("h1");
        questionText.classList.add("size-24", "text-dark");
        questionText.innerText = this.question;

        let betAmountWrapper = document.createElement("div");
        betAmountWrapper.classList.add("relative-wrapper", "coin-wrapper");
        let count = document.createElement("p");
        count.classList.add("text-light", "acme");
        count.innerText = this.betAmount;
        let coin = document.createElement("img");
        coin.classList.add("coin");
        coin.setAttribute("src", "images/coin.svg");
        coin.setAttribute("alt", "Coins");

        let countWrapper = document.createElement("div");
        countWrapper.classList.add("peeps");
        let countWrapperTwo = document.createElement("div");
        countWrapperTwo.classList.add("relative-wrapper");
        let peopleCount = document.createElement("p");
        peopleCount.classList.add("text-light", "acme");
        peopleCount.innerText = this.numberOfBets;
        let peopleImage = document.createElement("i");
        peopleImage.classList.add("material-icons");
        peopleImage.innerText = "people";

        let buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("buts");

        let betButton = document.createElement("button");
        betButton.classList.add("mdc-button", "voteBtn", "mdc-ripple-uprgaded");
        betButton.disabled = true;
        betButton.innerText = "Place Bet";

        let shareButton = document.createElement("button");
        shareButton.classList.add("mdc-button", "mdc-ripple-upgraded");
        shareButton.innerText = "Share";
        shareButton.addEventListener("click", () => {
            console.log("TODO: Implement Share");
        });

		// If last bet time has ended, show betting is closed
		if (setTimeNow() > new Date(this.lastBetTime).getTime()) {
            betButton.innerText = "Bet Closed";
        }

        if (this.userHasPlacedBet()) {
            betButton.innerText = "Bet Locked In";
        }

		if (user.get("uid") == this.creator.uid && setTimeNow() > new Date(this.endTime).getTime() && !this.winningOption) {
            betButton.innerHTML = "Decide Winner";
		}

        let betCloseTime = document.createElement("p");
        betCloseTime.classList.add("size-14", "text-light");
        betCloseTime.innerText = calcTimeLeft(this.lastBetTime);

        bottomInfo.appendChild(questionText);
        betAmountWrapper.appendChild(count);
        betAmountWrapper.appendChild(coin);
        bottomInfo.appendChild(betAmountWrapper);
        betBottom.appendChild(bottomInfo);
        countWrapperTwo.appendChild(peopleCount);
        countWrapperTwo.appendChild(peopleImage);
        countWrapper.appendChild(countWrapperTwo);
        betBottom.appendChild(countWrapper);

        buttonWrapper.appendChild(betButton);
        buttonWrapper.appendChild(shareButton);
        betBottom.appendChild(buttonWrapper);
        betBottom.appendChild(betCloseTime);

        this.card.appendChild(betTop);
        this.card.appendChild(betMiddle);
        this.card.appendChild(betBottom);

        // Append the bet card to the grid.
        this.grid.appendChild(this.card);
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
    decideWinner() {
		let pickedOption;
		for (let i in this.options) {
			if (document.getElementById(i).checked == true) {
				pickedOption = i;
			}
		}
        db.ref('bets/' + this.id + "/winningOption/").set(pickedOption);
        db.ref('bets/' + this.id + '/active/').set(false);

        distributeWinnings(this.id);
	}
    createOptionsIn(container) {
        let numberOfOptions = 1;

        // For every option in the bet options object, create the HTML tags and append it to the container.
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

            if(this.winningOption == option) {
                let winner = document.createElement("span");
                winner.classList.add("text-dark");
                winner.style.float = "right";
                winner.style.fontWeight = "bold";
                winner.innerHTML = "<i class='fas fa-trophy'></i> Winner";
                p.appendChild(winner);

                div.classList.add("winnerOption");
            }

            for(let bet in user.get("betHistory")) {
                // For every placed bet in the user bet history, check if that bet is the current bet
                if(bet === this.id) {
                    // If the user has placed a bet on the current bet, check for the option
                    if(user.get("betHistory")[bet] === option) {
                        // This happens if a user has placed a bet on this option
                        input.checked = true;
                    }
                }
            }

            // If the user has placed a bet, OR the bet time has ended.
            if(this.userHasPlacedBet() || setTimeNow() > new Date(this.lastBetTime).getTime()) {
                // If the user is the bet creator and the bet has ended AND the bet has no winning option set. Enable decide Winner button.
                if (user.get("uid") == this.creator.uid && setTimeNow() > new Date(this.endTime) && !this.winningOption) {
                    this.card.classList.add("awaitingWinningOption");
                    input.addEventListener("click", () => {
                        this.enableDecideWinnerButton();
                    });
                }
                // If the user has placed a bet or the bet time has ended and the user is not the creator, disable the input buttons.
                else {
                    input.disabled = true;
                }
            }
            // If the user has not placed a bet and the lastBetTime has not ended, enable bet button.
            else {
                input.addEventListener("click", () => {
                    this.enableBetButton();
                });
            }

            div.appendChild(span);
            div.appendChild(p);
            label.appendChild(input);
            label.appendChild(div);

            container.appendChild(label);

            numberOfOptions++
        }

        return container;
    }
    enableBetButton() {
        let betButton = this.card.querySelectorAll("button")[0];
        betButton.innerText = "Place Bet";

        betButton.disabled = false;
        betButton.addEventListener("click", () => {
            this.placeBet();
        });
    }
    enableDecideWinnerButton() {
        let betButton = this.card.querySelectorAll("button")[0];
        betButton.innerText = "Decide Winner";

        betButton.disabled = false;
        betButton.addEventListener("click", () => {
            this.decideWinner();
        });
    }
    showBet() {
		//remove the hidden class
		document.querySelector("[data-id=" + this.id + "]").classList.remove("hidden");
	}
	hideBet() {
		//add the hidden class
		document.querySelector("[data-id=" + this.id + "]").classList.add("hidden");
	}
    shareBet() {
        // Integrate with Facebook API or another API to share the bet.
        console.log("To be implemented.");
    }
    userHasPlacedBet() {
		let userHasBet = false;
		db.ref(`bets/${this.id}/placedBets/`).once("value", snapshot => {
			let data = snapshot.val()
			for (let i in data) {
				if (i == user.get("uid")) {
					userHasBet = true;
				}
			}
		});
		return userHasBet;
	}
	placeBet() {
		let pickedOption;

		for(let i in this.options) {
			if(document.getElementById(i).checked == true) {
				pickedOption = i;
			}
        }

        if(!pickedOption) {
            console.log("No option picked, aborting");
            return false;
        }

		if(setTimeNow() < new Date(this.lastBetTime).getTime()) {
            let uid = user.get("uid");
            let betId = this.id;

            // Update users total coins placed count
            user.incrementProperty("totalCoinsPlaced", this.betAmount);

            // Remove coins from user
            user.incrementProperty("coins", -(this.betAmount));

            // Update user bet history
            db.ref(`users/${uid}/betHistory/${betId}`).set(pickedOption);

            // Add bet in database
            db.ref(`bets/${this.id}/placedBets/${uid}`).set(pickedOption);

            // Add the bet count to the bet
            db.ref(`bets/${this.id}/numberOfBets`).transaction(cur => {
                return cur + 1;
            });

            // Add coins to the pot
            db.ref(`bets/${this.id}/pot`).transaction(cur => {
                return cur + this.betAmount;
            });

            // TODO: After a user has placed a bet, disable the inputs on the bet and perhaps also update the info on the bet (number of bets for example)
            // Same for after a user has decided the winner of a bet, disable the inputs on the bet.
		}
	}
}
