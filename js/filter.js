// websiteadress/?search=value
// Parse the URL parameter
function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//search all bets with query. Query does not have to be exact if searching for title, question, or name.
function filterByQuery(query) {
	let matchedBets = [];
	//loop through the bet
	for (let bet in bets) {
		let obj = bets[bet];
		//hide previous 
		obj.hideBet();
	  	let lowerCaseQuery = query.toLowerCase();
		//if title, question, id or creators name includes query, or if id or uid is equal to query, push bet to mathchedBets
		if (obj.title.toLowerCase().includes(lowerCaseQuery) || obj.question.toLowerCase().includes(lowerCaseQuery) || obj.creator.name.toLowerCase().includes(lowerCaseQuery) || obj.id == query || obj.creator.uid == query) {
			matchedBets.push(obj);
		};
	};
	showBetsInArr(matchedBets);
};

//search for all bet id´s or uid´s in array
function filterByArr(arr) {
	let matchedBets = [];
	//Loop through all bets
	for (let bet in bets) {
		let obj = bets[bet];
		//hide all previous bets
		obj.hideBet();
		//loop through the array and check which bets will be displayed on page
		arr.forEach(bet => {
			//if id or uid is equal to bet, push bet to mathchedBets
			if (bet.id == obj.id || bet.creator.uid == obj.creator.uid) {
				matchedBets.push(bet);
			};
		}); 
	};
	showBetsInArr(matchedBets);
};

function showBetsInArr(arr) {
	if (arr.length == 0) {
		//show noResults
		document.getElementById("noResults").classList.remove("hidden");
	} else {
		//show all the matched bets
		arr.forEach(bet => bet.showBet());
	}
};

function getNotifications() {
	let notifArr = [];
	for (let bet in bets) {
		let obj = bets[bet];
		//if bets endTime has passed, is created by the user and does not have a winning option
		if (new Date(obj.endTime).getTime() < setTimeNow() && obj.creator.uid == user.uid && !obj.winningOption) {
			notifArr.push(obj);
		}
	}
	if (notifArr.length > 0) {
		let notifications = document.getElementById("notifications");
		notifications.innerText = "(" + notifArr.length + ")";
		notifications.style.cursor = "pointer";
		notifications.style.color = "#FF5D55";
		notifications.addEventListener("click", () => {
			filterByArr(notifArr);
		});
	}
};