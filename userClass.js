class User {
  constructor() {
      this.image = undefined; // Fetch image from facebook objekt
      this.name = undefined; // Fetch name from facebook objekt
      this.coins = undefined; // Fetch coins from database if null add 5000 as start
      this.rank = undefined; // Fetch rank from database if null set 0;
      this.wins = undefined; // Fetch wins from database if null set 0;
      this.loses = undefined; // Fetch wins from database if null set 0;
      this.totBets = this.wins + this.loses;
      this.winPercentage = this.wins / this.totBets;
      this.bettingLimit = 1000;
    },
    logout() {
      // Logout the user;
    },
    remove() {
      // Logout and delete the user from db;
    },
    changeName(name) {
      if (name != String || name.length > 30 || name.length < 3) {
        alert("Your name can't be longer then 30chars nor be less then 3. Are you even a String ?");
      } else {
        this.name = name;
      }
    },
    changeLimit(limit){
      if (limit != Number || limit.length > 6 || limit.length < 2){
        alert("Limit you must, between the length of 6 and 2 a Number should do.")
      } else {
        this.bettingLimit = limit;
      }
    }

}
// let user = newUser();
