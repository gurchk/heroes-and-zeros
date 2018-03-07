let userObj;

window.onload = function() {
    let facebookProvider = new firebase.auth.FacebookAuthProvider();

    let btnSignInWithRedirectFB = document.getElementById("btnSignInWithRedirectFB");
    let loginWrapper = document.getElementById("loginWrapper");
    let btnSignOut = document.getElementById("btnSignOut");
    let contentWrapper = document.getElementById("contentWrapper");
    let cover = document.getElementById("cover");
    let loginModal = document.getElementById("loginModal");
    let openModalBtn = document.getElementById("openModalBtn");
    let btnCastVote = document.getElementById("btnCastVote");

    //When user is logged in or logged out
    firebase.auth().onAuthStateChanged( user => {
        if (user) {
            userObj = {
              uid: user.uid,
              name: user.displayName,
              displayImage: user.photoURL
            };

            db.ref("users/" + user.uid).once("value", snapshot => {
                if(!snapshot.val()) {
                    // User doesn't exist in database yet
                    db.ref("users/" + user.uid).set({
                        displayImage: user.photoURL,
                        email: user.email,
                        name: user.displayName,
                        coins: 5000,
                        games: 0,
                        wins: 0,
                        losses: 0,
                        totalCoinsPlaced: 0,
                        totalCoinsWon: 0
                    });

                    // Send message in our Slack channel
                    let msg = "*" + user.displayName + " (uid: " + user.uid + ")* has just logged in for the first time!";
                    let data = {
                        "text": msg
                    }

                    fetch("https://hooks.slack.com/services/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", { method: "POST", body: JSON.stringify(data) });

                    //User is signed in. Hide login page and show the rest of the page.
                    updateUI(user.displayName, user.photoURL, "5000");
                }
                else {
                    // User exists in database
                    db.ref("users/" + user.uid).once("value", snapshot => {
                        let data = snapshot.val();

                        //User is signed in. Hide login page and show the rest of the page.
                        updateUI(data.name, data.displayImage, data.coins);
                    });
                }
            });
        } else {
            //User is signed out.
            loginWrapper.classList.remove("hidden");
            contentWrapper.classList.add("hidden");
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
    });

    btnSignInWithRedirectFB.addEventListener("click", () => {
        firebase.auth().signInWithRedirect(facebookProvider);
    });

    //Sign out
    btnSignOut.addEventListener("click", () => {
        firebase.auth().signOut()
        .then( () => {
            console.log("Sign out success!");
        }).catch( () => {
            console.log("Sign out failed");
        });
    });

    openModalBtn.addEventListener("click", () => {
        cover.classList.toggle("hidden");
        loginModal.classList.toggle("hidden");
    });

    cover.addEventListener("click", () => {
        cover.classList.add("hidden");
        loginModal.classList.add("hidden");
    });
}
