const bets = {};
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
    document.getElementById("username").innerText = user.name;
    document.getElementById("avatar").setAttribute("src", user.displayImage);
    document.getElementById("coins").innerText = user.coins;

    loginWrapper.classList.add("hidden");
    contentWrapper.classList.remove("hidden");

    loginFinished();
    hideLoadingScreen();

    fetchBetsFromDB();

    //if url has ?search="query"
    if (getParameterByName("search")!=null) {
        //store the query in a variable
        let searchQuery = getParameterByName('search');
        //TODO: Hitta bättre lösning!
        //delay by 1 second to wait untill fetchBetsFromDB is done.
        setTimeout(() => filterByQuery(searchQuery), 1000);
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

    let menuMyBets = document.getElementById("menuMyBets");
    menuMyBets.addEventListener("click", () => {
        let placedBets = [];
        let createdBets = [];
        closeMenu();

        // Get user placed and created bets.
        //getBets();

        function getBets() {
            db.ref("bets/").once("value", snap => {
                let bets = snap.val();
                let createdByUser = [];

                for(let bet in bets) {
                    if(bets[bet].creator.uid === user.uid && bets[bet].active) {
                        createdBets.push(bets[bet]);
                    }
                }

                console.log(createdBets);
            });
        }


        // Load the created bets
        function loadCreatedBets() {

        }

        // Load the placed bets
        function loadPlacedBets() {

        }

        document.getElementById("placedBetsBtn").addEventListener("click", () => {
            // Clear the grid
            document.getElementsByClassName("userBetsGrid")[0].innerHTML = "";
            loadPlacedBets();
        });
        document.getElementById("createdBetsBtn").addEventListener("click", () => {
            // Clear the grid
            document.getElementsByClassName("userBetsGrid")[0].innerHTML = "";
            loadCreatedBets();
        });


        document.getElementsByClassName("grid")[0].classList.add("hidden");
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

function fetchBetsFromDB() {
    document.getElementsByTagName('main')[0].innerHTML = "";

    db.ref("bets/").on("child_added", snapshot => {
        let data = snapshot.val();
        let key = snapshot.key;



        // Making a date to compare with
        const dateObj = new Date()
        const currentTimeOnPc = {
            year: dateObj.getUTCFullYear(),
            month: dateObj.getUTCMonth() + 1,
            day: dateObj.getUTCDate()
        }
        const computedDate = `${currentTimeOnPc.year}-${currentTimeOnPc.month}-${currentTimeOnPc.day}`
        // Checking if the bet has ended
        if (data.active === true && Date.parse(computedDate) > Date.parse(data.lastBetTime)) {
            if (data.winningOption.length === 0) { // Check if winningOption is set
                var isCreator = false;
                if (user.get("uid") == data.creator.uid) {
                    isCreator = true;
                }
                console.log("Renderring the card for the owner");
                let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions, true, isCreator);
                bet.createCard(document.getElementsByClassName("grid")[0]);
                let btns = document.querySelectorAll('.mdc-button');
                for (let i = 0, btn; btn = btns[i]; i++) {
                  mdc.ripple.MDCRipple.attachTo(btn);
                }
            } else if (Date.parse(computedDate) > Date.parse(data.endTime)){ // If winning option is set distributeWinnings
                console.log("Distributing winnings");
                db.ref('bets/' + key).update({
                    active: false,
                });
                distributeWinnings(data.winningOption, data.options, data.coinPot);
            }
        } else if (data.active === true) {
            // Render the bet normally
            console.log("Rendering the bet normally");
            let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions);
            bet.createCard(document.getElementsByClassName("grid")[0]);
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
});

    db.ref("bets/").on("child_changed", snapshot => {
        let data = snapshot.val();
        let key = snapshot.key;

        if(Object.keys(data.options).length === data.numberOfOptions && data.active === true) {

            // If the element already exists on the page, remove it
            let changedElement = document.querySelector("[data-id=" + key + "]");
            if(changedElement) {
                changedElement.parentNode.removeChild(changedElement);
            }

            let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions);
            bet.createCard(document.getElementsByClassName("grid")[0]);
        }
    });
}

function distributeWinnings(winningOption, options, coinPot) {
    for(let option in options) {
        if(option == winningOption) {
            // Winners bracket, add wins +1, totalCoinsWon +1, coins + whatever they won (pot split up on everyone)
            let winners = options[option];
            console.log(winners);
            //let winnings = Math.floor(coinPot/winners);

            for(let uid in options[option].placedBets) {
                /*
                let wins = db.ref("users/" + uid + "/wins");
                wins.transaction(wins => {
                    return (wins + 1);
                });

                let coinsWon = db.ref("users/" + uid + "/totalCoinsWon");
                coinsWon.transaction(totalCoinsWon => {
                    return (totalCoinsWon + winnings);
                });

                let coinCount = db.ref("users/" + uid + "/coins");
                coinCount.transaction(coins => {
                    return (coins + winnings);
                });*/
            }

        }
        else {
            // Losers bracket, add losses += 1
            for(let user in options[option].placedBets) {
                let ref = db.ref('users/' + user.uid + "/losses");
                ref.transaction(losses => {
                    return (losses + 1);
                });
            }
        }
    }
}

function loginFinished() {
    /* CreateBet Check for amount of options */
    inputOptionsDiv = document.getElementById("inputOptionsDiv");
    addOption = document.getElementById("addOption");
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

function filterByQuery(query) {
    console.log(bets);
    let unmatchedBets = [];
    //loop through the bets and check which ones will not be displayed on page
    for (let bet in bets) {
        let obj = bets[bet];
        //if not title, question, id, uid nor creators name matches query, push bet to unmathchedBets
        if (obj.title != query && obj.question != query && obj.id != query && obj.creator.uid != query && obj.creator.name != query) {
            unmatchedBets.push(obj);
        };
        //hide all the unmatched bets
        unmatchedBets.forEach( bet => bet.hideBet());
    };
};
