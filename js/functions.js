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

    document.getElementById("openMenu").addEventListener("click", function() {
        closeMenuCover.classList.remove("hidden");
        this.style.zIndex = "-1";
        this.style.display = "none";
        document.getElementById("closeMenu").style.zIndex = "2001";
        document.getElementById("closeMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(0)";
    });
    document.getElementById("closeMenu").addEventListener("click", function() {
        this.style.zIndex = "-1";
        this.style.display = "none";
        document.getElementById("openMenu").style.zIndex = "2001";
        document.getElementById("openMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(100%)";
    });

    let createBetCover = document.getElementById("createBetCover");
    let createBet = document.getElementById("createBet");
    let closeBet = document.getElementById('closeBet');
    let menuCreateBet = document.getElementById("menuCreateBet");

    menuCreateBet.addEventListener("click", () => {
        fadeIn(createBet);
        fadeIn(createBetCover);
    });

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

// fade in

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
    db.ref("bets/").on("child_added", snapshot => {
        let data = snapshot.val();
        let key = snapshot.key;

        if(data.active && data.options) {
            let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions);
            bet.createCard();

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
    //call this to start search.js
    search();
    });

    db.ref("bets/").on("child_changed", snapshot => {
        let data = snapshot.val();
        let key = snapshot.key;

        if(Object.keys(data.options).length === data.numberOfOptions) {

            // If the element already exists on the page, remove it
            let changedElement = document.querySelectorAll("data-id=" + key);
            if(changedElement) {
                changedElement.parentNode.removeChild(changedElement);
            }

            let bet = new Bet(key, data.title, data.question, data.betAmount, data.endTime, data.lastBetTime, data.creator, data.numberOfBets, data.options, data.numberOfOptions);
            bet.createCard();
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
