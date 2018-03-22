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
	addDatePicker();

    document.getElementById("openMenu").addEventListener("click", function() {
        openMenu();
    });
    document.getElementById("closeMenu").addEventListener("click", function () {
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

    closeBet.addEventListener("click", function () {
        fadeOut(createBet);
        fadeOut(createBetCover);
    });

    createBetCover.addEventListener("click", function () {
        fadeOut(createBet, "block");
        fadeOut(document.getElementsByClassName("removeBet")[0], "block")
        fadeOut(createBetCover);
    });

    let closeMenuCover = document.getElementById("closeMenuCover");
    closeMenuCover.addEventListener("click", function () {
        document.getElementById("closeMenu").style.zIndex = "-1";
        document.getElementById("closeMenu").style.display = "none";
        document.getElementById("openMenu").style.zIndex = "2001";
        document.getElementById("openMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(100%)";

        closeMenuCover.classList.add("hidden");
    });

    let menuCreateBet = document.querySelectorAll(".menuCreateBet");
    for(let i = 0; i < menuCreateBet.length; i++) {
        menuCreateBet[i].addEventListener("click", () => {
            closeMenu();
            fadeIn(createBet);
            fadeIn(createBetCover);
            window.scrollTo(0, 0);
        });
    }

    let menuStatistics = document.querySelectorAll(".menuStatistics");
    for(let i = 0; i < menuStatistics.length; i++) {
        menuStatistics[i].addEventListener("click", () => {
            closeMenu();
            showStatistics();
        });
    }
}

function fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

function fadeIn(el, display) {
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

function removeActiveClassFromBtns() {
	document.getElementById("activeBetsBtn").classList.remove("active");
	document.getElementById("createdBetsBtn").classList.remove("active");
 	document.getElementById("placedBetsBtn").classList.remove("active");
}

function hideNoResults() {
	document.getElementById("noResults").classList.add("hidden");
}

window.addEventListener("load", () => {
    let activeBetsBtn = document.getElementById("activeBetsBtn");
    let createdBetsBtn = document.getElementById("createdBetsBtn");
    let placedBetsBtn = document.getElementById("placedBetsBtn");

    activeBetsBtn.addEventListener("click", () => {
        hideNoResults();
		removeActiveClassFromBtns();
        showBets(activeBets);
        activeBetsBtn.classList.add("active");
    });

    createdBetsBtn.addEventListener("click", () => {
		hideNoResults();
		removeActiveClassFromBtns();
        showBets(createdBets);
        createdBetsBtn.classList.add("active");
    });

    placedBetsBtn.addEventListener("click", () => {
        hideNoResults();
		removeActiveClassFromBtns();
        showBets(placedBets);
        placedBetsBtn.classList.add("active");
    });
});

function showBets(betList) {
    document.getElementsByClassName("grid")[0].innerHTML = "";

    if(betList.length === 0) {
        hideNoResults();
    }
    else {
        // Sort arrays by endTime so that the one ending the soonest appears first.
        /*
        betList.sort( (a,b) => {
            return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        });
        */
        // Or sort by lastBetTime
        betList.sort( (a,b) => {
            return new Date(a.lastBetTime).getTime() - new Date(b.lastBetTime).getTime();
        });
        betList.forEach( bet => {
            bet.createCard();
        });

    }
}

function fetchBetsFromDB() {
    document.getElementsByTagName('main')[0].innerHTML = "";

    db.ref("bets/").once("value", snapshot => {
        let data = snapshot.val();

        for(let key in data) {
            let bet = new Bet(
                key,
                data[key].title,
                data[key].question,
                data[key].betAmount,
                data[key].endTime,
                data[key].lastBetTime,
                data[key].creator,
                data[key].numberOfBets,
                data[key].options,
                data[key].numberOfOptions,
                data[key].winningOption,
                data[key].pot
            );

            bets[key] = bet;

            // Add active bets to activeBets object
            if(data[key].active) {
                activeBets.push(bet);
            }

            // Add created bets to createdBets object
            if(data[key].creator.uid === user.get("uid")) {
                createdBets.push(bet);
            }

            // Add placed bets to placedBets object
            for(let id in user.get("betHistory")) {
                if(id === key) {
                    placedBets.push(bet);
                }
            }
        }

        document.getElementById("activeBetsCounter").innerText = "(" + activeBets.length + ")";
        document.getElementById("createdBetsCounter").innerText = "(" + createdBets.length + ")";
        document.getElementById("placedBetsCounter").innerText = "(" + placedBets.length + ")";

        activeBetsBtn.classList.add("active");
        createdBetsBtn.classList.remove("active");
        placedBetsBtn.classList.remove("active");

        getNotifications();

        // Add ripple effect to buttons
        let btns = document.querySelectorAll('.mdc-button');
        let fabs = document.querySelectorAll('.mdc-fab');
        for (let i = 0, btn; btn = btns[i]; i++) {
          mdc.ripple.MDCRipple.attachTo(btn);
        }
        for (let i = 0, fab; fab = fabs[i]; i++) {
          mdc.ripple.MDCRipple.attachTo(fab);
        }
	 	
		//show active bets if searchQuery == null
		let searchQuery = getParameterByName('search');
        //if url has ?search="query"
        if (searchQuery != null) {
            filterByQuery(searchQuery);
        } else {
        	showBets(activeBets);
		}
    });
}

db.ref("bets/").on("child_changed", snapshot => {
    let data = snapshot.val();
    let key = snapshot.key;

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

    bets[key] = bet;

    if(data.active && Object.keys(data.options).length == data.numberOfOptions) {
        let index;
        // Find the bet in the array and replace it with the changed bet
        index = activeBets.findIndex( obj => {
            return obj.id === key;
        });

        // Update the bet
        if(index != -1) {
            activeBets[index] = bet;
        }
        else {
            activeBets.push(bet);
        }

        if(data.creator.uid === user.get("uid")) {
            index = createdBets.findIndex( obj => {
                return obj.id === key;
            });

            if(index != -1) {
                createdBets[index] = bet;
            }
            else {
                createdBets.push(bet);
            }
        }

        for(let id in user.get("betHistory")) {
            if(id === key) {
                index = placedBets.findIndex( obj => {
                    return obj.id === key;
                });

                if(index != -1) {
                    placedBets[index] = bet;
                }
                else {
                    placedBets.push(bet);
                }
            }
        }

        removeActiveClassFromBtns();
        showBets(activeBets);
    }
});

db.ref("bets/").on("child_removed", snapshot => {
    let data = snapshot.val();
    let key = snapshot.key;

    let removedBet = document.querySelector("[data-id=" + key + "]");
    removedBet.parentNode.removeChild(removedBet);
    
    for(let i = 0; i < activeBets.length; i++) {
        if(activeBets[i] == bets[key]) {
            console.log("Removing from Active Bets");
            activeBets.splice(i, 1);
        }
    }
    
    for(let i = 0; i < createdBets.length; i++) {
        if(createdBets[i] == bets[key]) {
            console.log("Removing from Created Bets");
            createdBets.splice(i, 1);
        }
    }

    for(let i = 0; i < placedBets.length; i++) {
        if(placedBets[i] == bets[key]) {
            console.log("Removing from Placed Bets");
            placedBets.splice(i, 1);
        }
    }

    console.log("Removing bet from object");
    bets[key] = undefined;
});

function distributeWinnings(id) {
    db.ref("bets/" + id).once("value", function (snapshot) {
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

        let calcWinnings = bet.pot / winners.length;

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
    addOption.addEventListener("click", function () {
        // Check current amount of options
        if (document.querySelectorAll(".inputOption").length < 20) {
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

let calcTimeLeft = function (lastBetTime) {
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

let setTimeNow = function () {
    let timeNow;
    db.ref(`users/${user.get("uid")}/currentTime`).set(firebase.database.ServerValue.TIMESTAMP);
    db.ref(`users/${user.get("uid")}/currentTime`).once("value", function (snapshot) {
        timeNow = snapshot.val();
    });
    return timeNow;
}

function addDatePicker() {
	$("#lastBet").datepicker({
		dateFormat : 'yy-mm-dd'
	});
	$("#endtime").datepicker({
		dateFormat : 'yy-mm-dd'
	});
};

function submitIndicator(element) {
    element.classList.add("tempIndicator");
    setTimeout(function (){
        element.classList.remove("tempIndicator");
    }, 1500);
}

function showStatistics(uid) {
    if(uid) {
        db.ref("users/" + uid).once("value", snapshot => {
            let data = snapshot.val();
            createStatisticsWindow(data);
        });
    }
    else {
        createStatisticsWindow(user);
    }
}

function createStatisticsWindow(user) {
    let properties = [
        ["Wins", user.wins],
        ["Losses", user.losses],
        ["Coins Bet", user.totalCoinsPlaced],
        ["Coins Won", user.totalCoinsWon],
        ["Coins", user.coins],
    ];

    /* Cover + Modal */
    let cover = document.createElement("div");
    cover.classList.add("cover");
    cover.id = "statisticsCover";
    cover.addEventListener("click", () => {
        modal.parentNode.removeChild(modal);
        cover.parentNode.removeChild(cover);
    });

    let modal = document.createElement("div");
    modal.id = "statisticsModal";
    /* End Cover + Modal */

    /* Close Button */
    let close = document.createElement("button");
    close.id = "closeStatistics";
    close.innerText = "×";
    close.addEventListener("click", () => {
        modal.parentNode.removeChild(modal);
        cover.parentNode.removeChild(cover);
    });
    modal.appendChild(close);
    /* End Close Button */

    /* Stat Header */
    let statHeader = document.createElement("div");
    statHeader.classList.add("statHeader");

    let h2 = document.createElement("h2");
    h2.innerText = "User Statistics";

    let img = document.createElement("img");
    img.classList.add("statAvatar");
    img.setAttribute("alt", "Display Image");
    img.src = user.displayImage;

    let p = document.createElement("p");
    p.classList.add("text-dark");
    p.innerText = user.name;

    statHeader.appendChild(h2);
    statHeader.appendChild(img);
    statHeader.appendChild(p);

    modal.appendChild(statHeader);
    /* End of Stat Header */

    /* Stat Wrapper */
    let statWrapper = document.createElement("div");
    statWrapper.classList.add("statWrapper");

    properties.forEach(prop => {
        let stat = document.createElement("stat");
        stat.classList.add("stat");

        let h3 = document.createElement("h3");
        h3.innerText = prop[0];

        let p = document.createElement("p");
        p.classList.add("statistic");
        p.innerText = prop[1];

        stat.appendChild(h3);
        stat.appendChild(p);

        statWrapper.appendChild(stat);
    });

    modal.appendChild(statWrapper);
    /* End of Stat Wrapper*/

    document.getElementById("contentWrapper").appendChild(cover);
    document.getElementById("contentWrapper").appendChild(modal);
}
