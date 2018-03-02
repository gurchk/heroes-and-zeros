class User {
  constructor() {
      this.uid = uid;
      this.displayImage = displayImage; // Fetch image from facebook objekt
      this.name = name; // Fetch name from facebook objekt
      this.coins = coins; //fetch from db || 5000;
      this.rank = rank; // Fetch rank from database || 0;
      this.wins = wins; // Fetch wins from database || 0;
      this.loses = loses; // Fetch wins from database || 0;
      this.totBets = this.wins + this.loses;
      this.winPercentage = this.wins / this.totBets;
      this.bettingLimit = bettingLimit; // Fetch bettinglimit from db || 1000;
    }
    logout() {
        // Logout the user
        firebase.auth().signOut()
        .then( () => {
            console.log("Signed out user.");
        }).catch( err => {
            console.log("Error when signing out, error: ", err.message);
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
                .catch( err => {
                    console.log("Eror when deleting user, error: ", err.message);
                });
            })
            .catch( err => {
                console.log("Error when signing out, error: ", err.message);
            });
        });

        popupDecline.addEventListener("click", function() {
            popupWarning.classList.add("hidden");
        });
    }
    setName(newName) {
      if (typeof(newName) != "string"  || name.length > 30 || name.length < 3) {
        alert("Your name cannot be longer than 30 characters nor less than 3. Do you even String?");
      } else {
        this.name = name;
        db.ref("users/" + this.uid).set({
            name: newName
        });
      }
    }
    getProperty(property) {
        return this[property];
    }
}
// let user = newUser();
