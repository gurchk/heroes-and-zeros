// Initialize Firebase
var config = {
    apiKey: "AIzaSyD46CxE-8uJDebx5ErANO9SOMOGuTxZiVQ",
    authDomain: "heroesand0s.firebaseapp.com",
    databaseURL: "https://heroesand0s.firebaseio.com",
    projectId: "heroesand0s",
    storageBucket: "heroesand0s.appspot.com",
    messagingSenderId: "146002108416"
};
firebase.initializeApp(config);

const db = firebase.database();

function hideLoadingScreen() {
    let loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.add("hidden");
}

function showLoadingScreen() {
    let loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.remove("hidden");
}

function updateUI() {
    document.getElementById("username").innerText = user.get("name");
    document.getElementById("avatar").setAttribute("src", user.get("displayImage"));
    document.getElementById("coins").innerText = user.get("coins");

    loginWrapper.classList.add("hidden");
    contentWrapper.classList.remove("hidden");

    loginFinished();
    hideLoadingScreen();

    fetchBetsFromDB();
	setTimeout(()=> getNotifications(), 500);

    //if url has ?search="query"
	if (getParameterByName("search") != null) {
		//delay by 0.5 seconds to wait untill fetchBetsFromDB is done.
		setTimeout(() => filterByQuery(getParameterByName('search')), 500);
	};

    document.getElementById("openMenu").addEventListener("click", function() {
        openMenu();
    });
    document.getElementById("closeMenu").addEventListener("click", function() {
        closeMenu();
    });

    function openMenu() {
        closeMenuCover.classList.remove("hidden");
        document.getElementById("openMenu").style.zIndex = "-1";
        document.getElementById("openMenu").style.display = "none";
        document.getElementById("closeMenu").style.zIndex = "2001";
        document.getElementById("closeMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(0)";
    }

    function closeMenu() {
        closeMenuCover.classList.add("hidden");
        document.getElementById("closeMenu").style.zIndex = "-1";
        document.getElementById("closeMenu").style.display = "none";
        document.getElementById("openMenu").style.zIndex = "2001";
        document.getElementById("openMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(100%)";
    }

    let createBetCover = document.getElementById("createBetCover");
    let createBet = document.getElementById("createBet");
    let closeBet = document.getElementById('closeBet');

    closeBet.addEventListener("click", function() {
        fadeOut(createBet);
        fadeOut(createBetCover);
    });

    createBetCover.addEventListener("click", function() {
        fadeOut(createBet, "block");
        fadeOut(createBetCover);
    });

    let closeMenuCover = document.getElementById("closeMenuCover");
    closeMenuCover.addEventListener("click", function() {
        document.getElementById("closeMenu").style.zIndex = "-1";
        document.getElementById("closeMenu").style.display = "none";
        document.getElementById("openMenu").style.zIndex = "2001";
        document.getElementById("openMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(100%)";

        closeMenuCover.classList.add("hidden");
    });

    let menuCreateBet = document.getElementById("menuCreateBet");
    menuCreateBet.addEventListener("click", () => {
        closeMenu();
        fadeIn(createBet);
        fadeIn(createBetCover);
    });
}

function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
    if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
    } else {
        requestAnimationFrame(fade);
    }
    })();
}

function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
    }
    })();
}

window.addEventListener("load", () => {

    let allBetsBtn = document.getElementById("allBetsBtn");
    let createdBetsBtn = document.getElementById("createdBetsBtn");
    let placedBetsBtn = document.getElementById("placedBetsBtn");
    
    allBetsBtn.addEventListener("click", () => {
        document.getElementById("noResults").classList.add("hidden");
        showAllBets();
        allBetsBtn.classList.add("active");
        createdBetsBtn.classList.remove("active");
        placedBetsBtn.classList.remove("active");
    }); 
    
    createdBetsBtn.addEventListener("click", () => {
        document.getElementById("noResults").classList.add("hidden");
        showCreatedBets();
        createdBetsBtn.classList.add("active");
        placedBetsBtn.classList.remove("active");
        allBetsBtn.classList.remove("active");
    });
    
    placedBetsBtn.addEventListener("click", () => {
        document.getElementById("noResults").classList.add("hidden");
        showPlacedBets();
        placedBetsBtn.classList.add("active");
        createdBetsBtn.classList.remove("active");
        allBetsBtn.classList.remove("active");
    });
});

function showAllBets() {
    document.getElementsByClassName("grid")[0].innerHTML = "";

    for(let bet in bets) {
        bets[bet].createCard();
    }

    if(Object.keys(bets).length === 0) {
        document.getElementById("noResults").classList.remove("hidden");
    }
}

function showCreatedBets() {
    document.getElementsByClassName("grid")[0].innerHTML = "";
    let count = 0;

    for(let bet in bets) {
        if(bets[bet].creator.uid === user.get("uid")) {
            bets[bet].createCard();
            count++;
        }
    }

    if(count === 0) {
        document.getElementById("noResults").classList.remove("hidden");
    }
}

function showPlacedBets() {
    document.getElementsByClassName("grid")[0].innerHTML = "";
    let count = 0;

    for(let bet in bets) {
        for(let id in user.get("betHistory")) {
            if(id === bet) {
                bets[bet].createCard();
                bets[bet].card.style.pointerEvents = "none";
                count++;
            }
        }
    }

    if(count === 0) {
        document.getElementById("noResults").classList.remove("hidden");
    }
}

function fetchBetsFromDB() {
    document.getElementsByTagName('main')[0].innerHTML = "";

    db.ref("bets/").on("child_added", snapshot => {
        let data = snapshot.val();
        let key = snapshot.key;

        // If the bet is inactive, AKA a winning option has been chosen, don't render it on the page. Maybe do something else with it 
        if(data.options) {
            let bet = new Bet(
                key, 
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

            bets[key] = bet;
		  	//if the search query string is not empty hide all cards
            if (getParameterByName("search") != null) {
            	bet.hideBet();
			}
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

        document.getElementById("allBetsCounter").innerText = "(" + Object.keys(bets).length + ")";

        allBetsBtn.classList.add("active");
        createdBetsBtn.classList.remove("active");
        placedBetsBtn.classList.remove("active");
    });
}

function distributeWinnings(id) {
    db.ref("bets/" + id).once("value", function(snapshot) {
        let bet = snapshot.val();
        let winners = [];
        let losers = [];
        for (let user in bet.placedBets) {
            let userSelect = bet.placedBets[user];
            if (userSelect === bet.winningOption) {
                winners.push(user);
            } else {
                losers.push(user);
            }
        }
        losers.forEach(loser => {
            db.ref(`users/${loser}/games`).transaction(cur => {
                return cur + 1;
            });
            db.ref(`users/${loser}/losses`).transaction(cur => {
                return cur + 1;
            });
        });

        let calcWinnings = bet.pot/winners.length;

        winners.forEach(winner => {
            db.ref(`users/${winner}/games`).transaction(cur => {
                return cur + 1;
            });
            db.ref(`users/${winner}/wins`).transaction(cur => {
                return cur + 1;
            });
            db.ref(`users/${winner}/coins`).transaction(cur => {
                return cur + calcWinnings;
            });
            db.ref(`users/${winner}/totalCoinsWon`).transaction(cur => {
                return cur + calcWinnings;
            });
        });
    });
  }

function loginFinished() {
    /* CreateBet Check for amount of options */
    let inputOptionsDiv = document.getElementById("inputOptionsDiv");
    let addOption = document.getElementById("addOption");
    // Add click on add more options
    addOption.addEventListener("click", function() {
        // Check current amount of options
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
}

let calcTimeLeft = function(lastBetTime) {
	let d = new Date();
	let date;
	date = d.getFullYear();
	(d.getMonth() + 1) < 10 ? date += "-0" + (d.getMonth() + 1) : date += "-" + (d.getMonth() + 1);
	d.getDate() < 10 ? date += "-0" + d.getDate() : date += "-" + d.getDate();

    let timeLeft = (new Date(lastBetTime).getTime() / 1000) - (new Date(date).getTime() / 1000)

	if (timeLeft < 259200) {
		if (timeLeft < 172800) {
			if (timeLeft < 86400) {
				if (timeLeft <= 0) {
					return "Betting Closed";
				}
				return "Betting closes in less than 1 day";
			}
			return "Betting closes in less than 2 days";
		}
		return "Betting closes in less than 3 days";
	} else {
		return "Betting closes at " + lastBetTime;
	}
}

let setTimeNow = function() {
	let timeNow;
	db.ref(`users/${user.get("uid")}/currentTime`).set(firebase.database.ServerValue.TIMESTAMP);
	db.ref(`users/${user.get("uid")}/currentTime`).once("value", function(snapshot) {
		timeNow = snapshot.val();
	});
	return timeNow;
}