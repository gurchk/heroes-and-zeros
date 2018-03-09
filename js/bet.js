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

	if (!error) {
		let errors = document.getElementsByClassName("error");
		while (errors.length > 0) {
			errors[errors.length - 1].parentNode.removeChild(errors[errors.length - 1]);
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
			numberOfOptions: optionCount,
			winnerSelect: false,
			isCreator: false,
		}

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
	constructor(id, title, question, coins, endTime, lastBetTime, creator, numberOfBets, options, numberOfOptions, winnerSelect = false, isCreator = false) {
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
		this.card = null;
		this.winnerSelect = winnerSelect;
		this.isCreator = isCreator;
		this.eventTargetId;
	}
	createCard(container) {
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

		if (this.winnerSelect != false) {
			betTop.appendChild(waitingForWinSelect);
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
		betButton.classList.add("mdc-button", "voteBtn", "mdc-ripple-upgraded");
		betButton.disabled = true;
		betButton.innerText = "Place Bet";
		let selectWinnerBtn = document.createElement("button");
		selectWinnerBtn.classList.add("mdc-button", "mdc-ripple-upgraded", "select-winner", "voteBtn");
		selectWinnerBtn.disabled = true;
		selectWinnerBtn.innerText = "Decide winner";
		selectWinnerBtn.addEventListener('click', (event) => {
			this.decideWinner;
		})
		let shareButton = document.createElement("button");
		shareButton.classList.add("mdc-button", "mdc-ripple-upgraded");
		shareButton.innerText = "Share";
		shareButton.addEventListener("click", () => {
			console.log("TODO: Implement Share");
		});

		let betCloseTime = document.createElement("p");
		betCloseTime.classList.add("size-14", "text-light");
		betCloseTime.innerText = "Betting closes in: " + this.lastBetTime;

		bottomInfo.appendChild(questionText);
		betAmountWrapper.appendChild(count);
		betAmountWrapper.appendChild(coin);
		bottomInfo.appendChild(betAmountWrapper);
		betBottom.appendChild(bottomInfo);
		countWrapperTwo.appendChild(peopleCount);
		countWrapperTwo.appendChild(peopleImage);
		countWrapper.appendChild(countWrapperTwo);
		betBottom.appendChild(countWrapper);
		if (this.winnerSelect != true) {
			buttonWrapper.appendChild(betButton);
			betButton.onclick = () => {
				this.castVote();
			}
		} else if (this.isCreator === true) {
			buttonWrapper.appendChild(selectWinnerBtn);
			selectWinnerBtn.onclick = () => {
				this.decideWinner(this.eventTargetId);
			}
		}

		buttonWrapper.appendChild(shareButton);
		betBottom.appendChild(buttonWrapper);
		betBottom.appendChild(betCloseTime);

		this.card.appendChild(betTop);
		this.card.appendChild(betMiddle);
		this.card.appendChild(betBottom);

		// Append the bet card to the grid.
		container.appendChild(this.card);
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
	decideWinner(eventTargetId) {
		console.log(eventTargetId);
		db.ref("bets/").once("child_changed", snapshot => {
				let data = snapshot.val();
				let key = snapshot.key;
				let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions, false, true);
				bet.createCard(document.getElementsByClassName("grid")[0]);
			});
			db.ref('bets/' + this.id).update({
				winningOption: eventTargetId,
			});

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

				input.addEventListener("click", (event) => {
					this.enableVoteButton();
					this.eventTargetId = event.target.id;
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
			let castBtn = this.card.querySelectorAll("button")[0];
			castBtn.disabled = false;
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
