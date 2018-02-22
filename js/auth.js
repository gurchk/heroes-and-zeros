window.addEventListener("load", () => {
  
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
  
  
  //Variable declaration
  let btnSignOut = document.getElementById("btnSignOut");
  let displayCurrentUser = document.getElementById("displayCurrentUser");

  firebase.auth().onAuthStateChanged( user => {
    if (user) {
      //User is signed in.  
      
      //Add h3 
      let h3DisplayName = document.createElement("h3");
      h3DisplayName.innerHTML = "Signed in as: " + user.displayName;
      h3DisplayName.id="h3UserName";
      displayCurrentUser.appendChild(h3DisplayName);

      //Add img
      let imgUserPhoto = document.createElement("img");
      imgUserPhoto.setAttribute("src", user.photoURL);
      imgUserPhoto.id="imgUserPhoto";
      displayCurrentUser.appendChild(imgUserPhoto);
    } else {
      //User is signed out.
      location.href = "index.html";
    }
  });
  
  btnSignOut.addEventListener("click", outlog => {
    firebase.auth().signOut().then( result => {
      console.log("Sign out success!");
    }).catch( fail => {
      console.log("Sign out failed");
    })        
  });
});