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
		lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*Betting must close before the bet ends.</p>");
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
		lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*That date has already passed.</p>");
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
                uid: user.uid, 
                displayImage: user.displayImage, 
                name: user.name 
            },
            active: true,
            numberOfBets: 0,
            winningOption: "",
            pot: 0,
            numberOfOptions: optionCount
        }

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

        // Hide the create bet window
        fadeOut(document.getElementById("createBet"), "block");
        fadeOut(document.getElementById("createBetCover"));
        fetchBetsFromDB();
    }
}

class Bet {
    constructor(id, title, question, coins, endTime, lastBetTime, creator, numberOfBets, options, numberOfOptions, winningOption) {
        this.id = id;
        this.title = title;
        this.question = question;
        this.coins = coins;
        this.endTime = endTime;
        this.lastBetTime = lastBetTime;
        this.creator = creator;
        this.numberOfBets = numberOfBets;
        this.options = options;
        this.numberOfOptions = numberOfOptions;
        this.card = undefined;
        this.grid = document.getElementsByClassName("grid")[0];
        this.winningOption = winningOption;
		this.placedBets = {};
    }
    createCard() {
        // Create the bet card and all its components, add their classes etc.
        this.card = document.createElement("div");
        this.card.classList.add("bet");
        this.card.setAttribute("data-id", this.id);

        let betTop = document.createElement("div");
        betTop.classList.add("bet-top");   

        if (this.winnerSelect != false) {
			var waitingForWinSelect = document.createElement("span");
			waitingForWinSelect.classList.add("size-14");
			waitingForWinSelect.innerHTML = "Waiting for winner selection";
        }
        
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
        count.innerText = this.coins;
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

        let selectWinnerBtn = document.createElement("button");
		selectWinnerBtn.classList.add("mdc-button", "mdc-ripple-upgraded", "select-winner", "voteBtn");
		selectWinnerBtn.disabled = true;
		selectWinnerBtn.innerText = "Decide Winner";
		selectWinnerBtn.addEventListener('click', event => {
			this.decideWinner;
        });
        
        //IF	kolla om creator == user.uid
		//	kolla endDate < setTimeNow
		//	kolla om winning option == false
		// skapa select winner button
		//db.ref(winningoption).set == bla bla
		if (!this.hasUserPlacedBet()) {
			betButton.onclick = () => {
                betButton.disabled = false;
				this.placeBet();
			}
		} else {
            betButton.innerText = "Bet Locked In";
            betButton.disabled = true;
		}

		//if last bet time has ended, show betting is closed
		if (setTimeNow() > new Date(this.lastBetTime).getTime()) {
			betButton.disabled = true;
			betButton.innerText = "Bet Closed";
        }
        
		if (user.get("uid") == this.creator.uid) {
			if (setTimeNow() > new Date(this.endTime).getTime()) {
				if (this.winningOption.length == 0) {
					buttonWrapper.appendChild(betButton);
					betButton.disabled = false;
					betButton.innerHTML = "Choose Winner";
					betButton.onclick = () => {
						this.decideWinner();
					}
				}
			}
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
				document.getElementById(i).checked = false;
			}
		}
		db.ref('bets/' + this.id).update({
			winningOption: pickedOption,
		});
		//distributeWinnings(pickedOption, options, coinPot)
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

            /*
            let userHasBet = false;
            for(let bet in user.betHistory) {
                // For every placed bet in the user bet history, check if that bet is the current bet
                if(bet === this.id) {
                    // If the user has placed a bet on the current bet, check for the option
                    if(user.betHistory[bet] === option) {
                        // This happens if a user has placed a bet on this option
                        input.checked = true;
                    }
                    else {
                        // This happens if a user has placed a bet on this bet, but not this option
                        input.disabled = true;
                    }

                    // Set userHasBet to true so that the input eventListener will not be set.
                    userHasBet = true;
                }

                // This happens if the user has not placed a bet on this bet, pressing any label enables the Place Bet button
            }

            // If the user has not placed a bet on this card, enable the button on selection.
            if(!userHasBet) {
                input.addEventListener("click", () => {
                    this.enableVoteButton();
                });
            }*/

            input.addEventListener("click", event => {
				if (this.hasUserPlacedBet() || setTimeNow() > new Date(this.lastBetTime).getTime()) {
					if (user.get("uid") == this.creator.uid && this.winningOption.length === 0) {
						this.enableVoteButton();
					} else {
						event.preventDefault();
					}
				} else {
					this.enableVoteButton();
				}
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
            this.placeBet();
        });
    }
    disableVoteButton() {
		let castBtn = this.card.querySelectorAll("button")[0];
		castBtn.disabled = true;

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
    hasUserPlacedBet() {
		let userHasPlacedBet = false;
		db.ref(`bets/${this.id}/placedBets/`).once("value", snapshot => {
			let data = snapshot.val()
			for (let i in data) {
				if (i == user.uid) {
					userHasPlacedBet = true;
				}
			}
		});
		return userHasPlacedBet;
	}
	placeBet() {
		let pickedOption;

		for (let i in this.options) {
			if (document.getElementById(i).checked == true) {
				pickedOption = i;
				document.getElementById(i).checked = false;
			}
		}

		if (setTimeNow() > new Date(this.lastBetTime).getTime()) {

			/// betting is not avialask

		} else {
			//PLACE BET IN DB
			let id = user.get("uid")
			db.ref(`bets/${this.id}/placedBets/${id}`).set(pickedOption);
			let tempThis = this;

			db.ref(`users/${id}/totalCoinsPlaced`).once("value", function(snapshot) {
				let data = snapshot.val();
				db.ref(`users/${id}/totalCoinsPlaced`).set(data + tempThis.coins);
			});

			//REMOVE COINS FROM USER
			db.ref(`users/${id}/coins`).once("value", function(snapshot) {

				let currentCoins = snapshot.val()
				db.ref(`users/${id}/coins`).set((currentCoins - tempThis.coins));
				db.ref(`users/${id}/totalCoinsPlaced`).set(tempThis.coins);

				updateUI(user.displayName, user.photoUrl, currentCoins - tempThis.coins);
			});
		}
	}
}
