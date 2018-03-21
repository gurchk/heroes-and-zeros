let user;
let startTime = Date.now();

window.onload = function() {
    let facebookProvider = new firebase.auth.FacebookAuthProvider();
	let googleProvider = new firebase.auth.GoogleAuthProvider();
    let btnSignInWithRedirectFB = document.getElementById("btnSignInWithRedirectFB");
	let btnSignInWithRedirectGoogle = document.getElementById("btnSignInWithRedirectGoogle");
    let loginWrapper = document.getElementById("loginWrapper");
    let contentWrapper = document.getElementById("contentWrapper");
    let cover = document.getElementById("cover");
    let loginModal = document.getElementById("loginModal");
	let loginHeader = document.getElementById("loginHeader");
	let loginText = document.getElementById("loginText");
    let openModalBtn = document.getElementById("openModalBtn");
    let btnCastVote = document.getElementById("btnCastVote");



    //When user is logged in or logged out
    firebase.auth().onAuthStateChanged( authUser => {
        if (authUser) {
            db.ref("users/" + authUser.uid).once("value", snapshot => {
                if(!snapshot.val()) {
                    // User doesn't exist in database yet
                    db.ref("users/" + authUser.uid).set({
                        displayImage: authUser.photoURL,
                        email: authUser.email,
                        name: authUser.displayName,
                        coins: 5000,
                        games: 0,
                        wins: 0,
                        losses: 0,
                        totalCoinsPlaced: 0,
                        totalCoinsWon: 0,
						betHistory: ""
                    });

                    // Create a new user object
                    user = new User(authUser.uid, authUser.photoURL, authUser.email, authUser.displayName, 5000, 0, 0, 0, 0, 0, "");
                    user.subscribeToUpdates();

                   // Send message in our Slack channel
                   let msg = "*" + authUser.displayName + " (uid: " + authUser.uid + ")* has just logged in for the first time!";
                   fetch("https://hooks.slack.com/services/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", { method: "POST", body: JSON.stringify({"text": msg}) });

                   //User is signed in. Hide login page and show the rest of the page.
                   updateUI();
                }
                else {
                    // User exists in database

                    // Grab data from db
                    let data = snapshot.val();

                    // Create a new user object using the data from database
                    user = new User(authUser.uid, data.displayImage, data.email, data.name, data.coins, data.games, data.wins, data.losses, data.totalCoinsPlaced, data.totalCoinsWon, data.betHistory);
                    user.subscribeToUpdates();

                    //User is signed in. Hide login page and show the rest of the page.
                    updateUI();
                }

                console.log("Loaded page in", ((Date.now() - startTime) / 1000), "seconds");
            });
        } else {
            //User is signed out.
            contentWrapper.classList.add("hidden");

            setTimeout(() => {
                loginWrapper.classList.remove("hidden");
            }, 500);

            showLoadingScreen();
        }
    });

    firebase.auth().getRedirectResult()
    .then(result => {
        if (result.credential) {
            console.log("Sign in success!");
        }
    }).catch(err => {
        console.log("Sign in failed, error: ", err.message);
		if (err.code == "auth/account-exists-with-different-credential") {
			cover.classList.toggle("hidden");
        	loginModal.classList.toggle("hidden");
			loginHeader.innerHTML = "Error";
			loginHeader.style.color = "#ff5d55";
			loginText.innerHTML = "Sorry, you can only sign in using the same authenthication provider you used when you registered."
		}
    });

    btnSignInWithRedirectFB.addEventListener("click", () => {
        firebase.auth().signInWithRedirect(facebookProvider);
    });

	btnSignInWithRedirectGoogle.addEventListener("click", () => {
        firebase.auth().signInWithRedirect(googleProvider);
    });
	
    //Sign out
    let signOutBtns = document.querySelectorAll(".btnSignOut");
    for(let i = 0; i < signOutBtns.length; i++) {
        signOutBtns[i].addEventListener("click", () => {
            firebase.auth().signOut()
            .then( () => {
                console.log("Sign out success!");
            }).catch( () => {
                console.log("Sign out failed");
            });
        });
    }

    openModalBtn.addEventListener("click", () => {
        cover.classList.toggle("hidden");
        loginModal.classList.toggle("hidden");
    });

    cover.addEventListener("click", () => {
        cover.classList.add("hidden");
        loginModal.classList.add("hidden");
    });
}
