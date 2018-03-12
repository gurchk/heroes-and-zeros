class User {
    constructor(uid, displayImage, email, name, coins, games, wins, losses, totalCoinsPlaced, totalCoinsWon, betHistory) {
        this.uid = uid;
        this.displayImage = displayImage; // Fetch image from facebook objekt
        this.email = email;
        this.name = name; // Fetch name from facebook objekt
        this.coins = coins; //fetch from db || 5000;
        this.games = games;
        this.wins = wins;
        this.losses = losses;
        this.totalCoinsPlaced = totalCoinsPlaced;
        this.totalCoinsWon = totalCoinsWon;
        this.betHistory = betHistory;
    }
    subscribeToUpdates() {
        console.log("Subscribing to user updates");

        db.ref("users/" + this.uid).on("child_changed", snapshot => {
            let property = snapshot.key;
            let value = snapshot.val();

            this[property] = value;

            let targets = document.querySelectorAll("." + property);
            targets.forEach(target => {
                target.innerText = this[property];
            });
        });
    }
    logout() {
        // Logout the user
        firebase.auth().signOut()
        .then( () => {
            console.log("Signed out user.");
        }).catch( error => {
            console.log("Error when signing out, error: ", error.message);
        });
    }
    remove() {
        // Logout and delete the user from db
        let warningText = "Are you sure?";
        let popupWarning = document.createElement("div");
        popupWarning.classList.add("popupWarning");
        popupWarning.id = "popupWarning";
        popupWarning.innerHTML = '<h3 class="warningText">', warningText, '</h3><button id="popupAgree" class="popupAgree">Yes</button><button id="popupDecline" class="popupDecline">No</button><p class="warningInfo">Clicking YES will remove your account and all details stored! This change cannot be reverted.</p>';

        let popupAgree = document.getElementById("popupAgree");
        let popupDecline = document.getElementById("popupDecline");

        popupAgree.addEventListener("click", function() {
            firebase.auth().signOut()
            .then( () => {
                db.ref("users/" + this.uid).remove()
                .then( () => {
                    console.log("Signed out and deleted user.");
                })
                .catch( error => {
                    console.log("Eror when deleting user, error: ", error.message);
                });
            })
            .catch( error => {
                console.log("Error when signing out, error: ", error.message);
            });
        });

        popupDecline.addEventListener("click", function() {
            popupWarning.classList.add("hidden");
        });
    }
    changeName(newName) {
        if(name.length > 30 || name.length < 3) {
            // TODO: Add warning to change name input.
            // alert("Your name cannot be longer than 30 characters nor less than 3. Do you even String?");
        } else {
            set("name", newName);
        }
    }
    changeAvatar(url) {
        let exp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
        if(url.match(exp)) {
            // url is valid
        }
        else {
            // url is not valid
        }
    }
    get(property) {
        return this[property];
    }
    set(property, value) {
        db.ref("users/" + this.uid + "/" + property).set(value);
    }
    incrementProperty(property, value) {
        // Get a reference from the database for users/userid/property, then set it to current value + given value
        let ref = db.ref("users/" + this.uid + "/" + property);
        ref.transaction(val => {
            return (val + value);
        });
    }
  }
