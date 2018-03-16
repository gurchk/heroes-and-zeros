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
  	console.log(query);
	//loop through the bet
	for (let bet in bets) {
		let obj = bets[bet];
		let lowerCaseQuery = query.toLowerCase();
		//if title, question, id or creators name includes query, or if id or uid is equal to query, push bet to mathchedBets
		if (obj.title.toLowerCase().includes(lowerCaseQuery) || obj.question.toLowerCase().includes(lowerCaseQuery) || obj.creator.name.toLowerCase().includes(lowerCaseQuery) || obj.id == query || obj.creator.uid == query) {
			matchedBets.push(obj);
		};
	};
  	showBets(matchedBets);
	removeActiveClassFromBtns();
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
  	let notifications = document.getElementById("notifications");
	//create and display notifications with active icon if notifications was found
	if (notifArr.length > 0) {
		let notifIcon = document.createElement("i");
		notifications.innerHTML = "";
		notifIcon.classList.add("material-icons");
		notifIcon.style.color = "#FF5D55";
		notifIcon.innerText = "notifications_active";
		notifications.appendChild(notifIcon);
		notifications.innerHTML += notifArr.length;
		notifications.style.cursor = "pointer";
		notifications.style.color = "#FF5D55";
		notifications.addEventListener("click", () => {
			showBets(notifArr);
			hideNoResults();
		  	removeActiveClassFromBtns();
		});
	  //else display inactive icon
	} else {
	  let notifIcon = document.createElement("i");
	  notifications.innerHTML = "";
	  notifIcon.classList.add("material-icons");
	  notifIcon.innerText = "notifications";
	  notifications.appendChild(notifIcon);
	}
};