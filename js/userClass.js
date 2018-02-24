class User {
  constructor() {
      this.image = undefined; // Fetch image from facebook objekt
      this.name = undefined; // Fetch name from facebook objekt
      this.coins = undefined; //fetch from db || 5000;
      this.rank = undefined; // Fetch rank from database || 0;
      this.wins = undefined; // Fetch wins from database || 0;
      this.loses = undefined; // Fetch wins from database || 0;
      this.totBets = this.wins + this.loses;
      this.winPercentage = this.wins / this.totBets;
      this.bettingLimit = // Fetch bettinglimit from db || 1000;
    },
    logout() {
      // Logout the user;
    },
    remove() {
      // Logout and delete the user from db;
    },
    changeName(name) {
      if (name != String || name.length > 30 || name.length < 3) {
        alert("Your name can't be longer then 30chars nor less then 3. Do you even String ?");
      } else {
        this.name = name;
        // save to db;
      }
    },
    changeLimit(limit) {
      if (limit != Number || limit.length > 6 || limit.length < 2) {
        alert("Limit you must, between the length of 6 and 2 a Number should do.")
      } else {
        this.bettingLimit = limit;
        // save to db;
      }
    }
}
// let user = newUser();
