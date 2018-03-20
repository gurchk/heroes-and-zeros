const bets = {};

const activeBets = [];
const createdBets = [];
const placedBets = [];

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

	options.forEach(option => {
		if (option.value) {
			optionValues.push({
				name: option.value
			});
			optionCount++;
		}
	});

	let error = false;

	//check for errors in input fields
	if (optionCount < 2) {
		document.getElementById("optionsError").classList.remove("hidden");
		error = true;
	}

	if (!title.value) {
		if (!title.nextElementSibling.className.includes("error")) {
			title.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
		}
		error = true;
	}

	if (!question.value) {
		if (!question.nextElementSibling.className.includes("error")) {
			question.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
		}
		error = true;
	}

	if (!betAmount.value) {
		if (!betAmount.nextElementSibling.className.includes("error")) {
			betAmount.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
		}
		error = true;
	}

	if (!endTime.value) {
		if (!endTime.nextElementSibling.className.includes("error")) {
			endTime.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
		}
		error = true;
	}

	if (!lastBetTime.value) {
		if (!lastBetTime.nextElementSibling.className.includes("error")) {
			lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*Field must have a value.</p>");
		}
		error = true;
	}

	//CHECK THAT LAST BET TIME OCCUR BEFORE BET END TIME
	if (lastBetTime.value > endTime.value) {
		if (!lastBetTime.nextElementSibling.className.includes("error")) {
			lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*Betting must close before the bet ends.</p>");
		}
		error = true;
	}

	//CREATE A DATE STRING IN THE SAME FORMAT AS INPUT FIELDS
	let d = new Date();
	let date;
	date = d.getFullYear();
	d.getMonth() + 1 < 10 ?
		(date += "-0" + (d.getMonth() + 1)) :
		(date += "-" + (d.getMonth() + 1));
	d.getDate() < 10 ?
		(date += "-0" + d.getDate()) :
		(date += "-" + d.getDate());

	//CHECK THAT LAST BET TIME AND BET END TIME IS AFTER TODAYS DATE
	if (lastBetTime.value < date || endTime.value < date) {
		if (!lastBetTime.nextElementSibling.className.includes("error")) {
			lastBetTime.insertAdjacentHTML("afterend", "<p class='error'>*That date has already passed.</p>");
		}
		error = true;
	}

	if (!error) {
		let errors = document.getElementsByClassName("error");
		while (errors.length > 0) {
			errors[errors.length - 1].parentNode.removeChild(errors[errors.length - 1]);
		}

		document.getElementById("optionsError").classList.add("hidden");

		// Add bet to database
		let data = {
			title: title.value,
			question: question.value,
			betAmount: Number(betAmount.value),
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
		};

		db.ref("bets/").push(data).then(snap => {
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
	}
}

class Bet {
	constructor(
		id,
		title,
		question,
		betAmount,
		endTime,
		lastBetTime,
		creator,
		numberOfBets,
		options,
		numberOfOptions,
		winningOption,
		pot
	) {
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
		this.enableBetButtonBool = false;
		this.enableSelectWinnerButton = false;
	}
	createCard() {
		// Create the bet card and all its components, add their classes etc.
		this.card = document.createElement("div");
		this.card.classList.add("bet");
		this.card.setAttribute("data-id", this.id);

		// Normal bet, don't add class

		// Placed bet, keep the green class
		if (this.userHasPlacedBet) {
			this.card.classList.add("placedBet");
		}
		// Won bet, add class with yellow/gold
		if (this.winningOption == user.betHistory[this.id]) {
			this.card.classList.add("wonBet");
		}
		// Lost bet, add class with red
		if (user.betHistory[this.id] && this.winningOption.length > 0 && this.winningOption != user.betHistory[this.id]) {
			this.card.classList.add("lostBet");
		}

		let betTop = document.createElement("div");
		betTop.classList.add("bet-top");

		let deleteBet = document.createElement("button");
		if (this.creator.uid == user.uid && new Date(this.lastBetTime).getTime() > setTimeNow()) {
			deleteBet.classList.add("mdc-button");
			deleteBet.innerText = "✖";
			let tempThis = this.id;
			let that = this;

			deleteBet.addEventListener("click", function() {
				window.scrollTo(0, 0);
				fadeIn(document.getElementsByClassName("removeBet")[0]);
				fadeIn(createBetCover);

				document.getElementById("yesRemoveBet").addEventListener("click", function() {
					that.removeBet(tempThis);
				});

				document.getElementById("noRemoveBet").addEventListener("click", function() {
					fadeOut(createBetCover);
					fadeOut(document.getElementsByClassName("removeBet")[0]);
				});
			});
		}

		let avatar = document.createElement("img");
		avatar.classList.add("userImage", "avatar");
		avatar.setAttribute("src", this.creator.displayImage);
		avatar.setAttribute("alt", this.creator.name);
		avatar.style.cursor = "Pointer";
		avatar.addEventListener("click", () => {
			showStatistics(this.creator.uid);
		});

		let topInfo = document.createElement("div");
		topInfo.classList.add("inf");
		let betTitle = document.createElement("p");
		betTitle.classList.add("size-14", "text-dark");
		betTitle.innerText = this.title;

		let createdBy = document.createElement("p");
		createdBy.classList.add("size-14", "text-light");
		createdBy.innerText = "Created by: " + this.creator.name;
		createdBy.style.cursor = "Pointer";
		createdBy.addEventListener("click", () => {
			showStatistics(this.creator.uid);
		});

		let endDate = document.createElement("p");
		endDate.classList.add("size-14", "text-light");
		endDate.innerText = "End date: " + this.endTime;

		// If there's no winning option and the bet has ended, add winner selection text
		if (!this.winningOption && setTimeNow() > new Date(this.endTime).getTime()) {
			endDate.innerText = "Awaiting winner selection";
			endDate.style.color = "#ff5d55";
		}

		topInfo.appendChild(betTitle);
		topInfo.appendChild(createdBy);

		if (this.creator.uid == user.uid && new Date(this.lastBetTime).getTime() > setTimeNow()) {
			betTop.appendChild(deleteBet);
		}

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
		peopleCount.classList.add("text-light", "acme", "numBets");
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
		shareButton.innerHTML = "Share <i class='fab fa-facebook-square'></i>";

		let tempId = this.id;
		shareButton.addEventListener("click", () => {
			FB.ui({
				method: 'share',
				mobile_iframe: true,
				href: `https://gurchk.github.io/heroes-and-zeros//?search=“${tempId}”`,
			}, function(response) {});
		});

		// If last bet time has ended, show betting is closed
		if (setTimeNow() > new Date(this.lastBetTime).getTime()) {
			betButton.innerText = "Bet Closed";
		}

		if (this.userHasPlacedBet()) {
			betButton.innerText = "Bet Placed";
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
	decideWinner() {
		let pickedOption;
		for (let i in this.options) {
			if (document.getElementById(i).checked == true) {
				pickedOption = i;
			}
		}

		db.ref("bets/" + this.id + "/winningOption/").set(pickedOption);
		db.ref("bets/" + this.id + "/active/").set(false);

		distributeWinnings(this.id);
		getNotifications()
	}
	createOptionsIn(container) {
		let numberOfOptions = 1;

		// For every option in the bet options object, create the HTML tags and append it to the container.
		for (let option in this.options) {
			let evenOrOdd;

			if ((numberOfOptions % 2) == 0)
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

			if (this.winningOption == option) {
				let winner = document.createElement("span");
				winner.classList.add("text-dark");
				winner.style.float = "right";
				winner.style.fontWeight = "bold";
				winner.innerHTML = "<i class='fas fa-trophy'></i> Winner";
				p.appendChild(winner);

				div.classList.add("winnerOption");
			}

			for (let bet in user.get("betHistory")) {
				// For every placed bet in the user bet history, check if that bet is the current bet
				if (bet === this.id) {
					// If the user has placed a bet on the current bet, check for the option
					if (user.get("betHistory")[bet] === option) {
						// This happens if a user has placed a bet on this option
						input.checked = true;
					}
				}
			}

			// If the user has placed a bet, OR the bet time has ended.
			if (this.userHasPlacedBet() || setTimeNow() > new Date(this.lastBetTime).getTime()) {
				// If the user is the bet creator and the bet has ended AND the bet has no winning option set. Enable decide Winner button.
				if (
					user.get("uid") == this.creator.uid &&
					setTimeNow() > new Date(this.endTime) &&
					!this.winningOption
				) {
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

			numberOfOptions++;
		}

		return container;
	}
	enableBetButton() {
		let betButton = this.card.querySelectorAll(".voteBtn")[0];
		betButton.innerText = "Place Bet";

		betButton.disabled = false;
		if (this.enableBetButtonBool != true) {
			this.enableBetButtonBool = true;
			betButton.addEventListener("click", () => {
				this.placeBet();
			});
		}
	}
	enableDecideWinnerButton() {
		let betButton = this.card.querySelectorAll(".voteBtn")[0];
		betButton.innerText = "Decide Winner";
		betButton.disabled = false;
		if (this.enableSelectWinnerButton != true) {
			this.enableSelectWinnerButton = true;
			betButton.addEventListener("click", () => {
				this.decideWinner();
			});
		}
	}
	showBet() {
		//remove the hidden class
		document.querySelector("[data-id=" + this.id + "]").classList.remove("hidden");
	}
	hideBet() {
		//add the hidden class
		console.log(this.id);
		console.log(document.querySelector("[data-id=" + this.id + "]"));
		document.querySelector("[data-id=" + this.id + "]").classList.add("hidden");
	}
	shareBet() {
		// Integrate with Facebook API or another API to share the bet.
		console.log("To be implemented.");
	}
	userHasPlacedBet() {
		let userHasBet = false;
		db.ref(`bets/${this.id}/placedBets/`).once("value", snapshot => {
			let data = snapshot.val();

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
		for (let i in this.options) {
			if (document.getElementById(i).checked == true) {
				pickedOption = i;
			}
		}

		if (!pickedOption) {
			console.log("No option picked, aborting");
			return false;
		}

		if (setTimeNow() < new Date(this.lastBetTime).getTime()) {
			let uid = user.get("uid");
			let betId = this.id;

			if (this.userHasPlacedBet()) {
				consle.log("User cant bet again");
			} else {
				let betButton = this.card.querySelectorAll('.voteBtn')[0];
				betButton.innerText = "Bet Placed";
				betButton.disabled = true;

				// Update users total coins placed count
				user.incrementProperty("totalCoinsPlaced", this.betAmount);

				// Remove coins from user
				user.incrementProperty("coins", -this.betAmount);

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
			}
		}

		// TODO: After a user has placed a bet, disable the inputs on the bet and perhaps also update the info on the bet (number of bets for example)
		// Same for after a user has decided the winner of a bet, disable the inputs on the bet.
		// Also update the text on the button to say "Bet Placed".
	}
	removeBet(id) {
		//fetch bet from DB again, if another user has placed bet since page loaded.
		db.ref(`bets/${id}/`).once("value", function(snapshot) {
			let data = snapshot.val()

			//check if users has placed bets
			if (data.placedBets) {
				//if they have refound the coins
				for (let i in data.placedBets) {
					db.ref(`users/${i}/coins`).once("value", function(current) {
						let coins = current.val()
						coins += data.betAmount;

						db.ref(`users/${i}/coins`).set(coins);
					});
				}
				//after coins removed delete the bet
				db.ref(`bets/${id}`).remove(function() {
					fadeOut(createBetCover)
					fadeOut(document.getElementsByClassName("removeBet")[0])
				});
			} else {
				db.ref(`bets/${id}`).remove(function() {
					fadeOut(createBetCover)
					fadeOut(document.getElementsByClassName("removeBet")[0])
				});
			}
		});
	}
}
