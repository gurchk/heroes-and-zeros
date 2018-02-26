window.onload = function() {
  const db = firebase.database();

  function slackMessageHandler(user) {
    // Check user unique identifier (uid) in database
    db.ref("users/" + user.uid).once("value").then(function(snapshot) {
      // If userData exists in database the user has already logged in prior to this.
      let userData = snapshot.val();
      if(!userData) {
        let msg = "*" + user.displayName + "* has just logged in for the first time!";
        let data = {
          "text": msg
        };

        fetch("https://hooks.slack.com/services/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", { method: "POST", body: JSON.stringify(data) });
      }
    });  
  }
}
