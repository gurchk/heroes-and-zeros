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
  const db = firebase.database();
  let providerFb = new firebase.auth.FacebookAuthProvider();
  let btnSignInFacebook = document.getElementById("btnSignInFacebook");
  let loginDiv = document.getElementById("loginDiv");
  let btnSignOut = document.getElementById("btnSignOut");
  let displayCurrentUser = document.getElementById("displayCurrentUser");

  //When user is logged in or logged out
  firebase.auth().onAuthStateChanged( user => {
    if (user) {
      //User is signed in.
      loginDiv.style.display = "none";
      
      //TODO: show rest of page, add this when adding the html structure
      displayCurrentUser.style = "block";
      
      //Add h3 
      let h3DisplayName = document.createElement("h3");
      h3DisplayName.innerHTML = "Signed in as: " + user.displayName;
      h3DisplayName.id="h3DisplayName";
      displayCurrentUser.appendChild(h3DisplayName);

      //Add img
      let imgUserPhoto = document.createElement("img");
      imgUserPhoto.setAttribute("src", user.photoURL);
      imgUserPhoto.id="imgUserPhoto";
      displayCurrentUser.appendChild(imgUserPhoto);

      db.ref("users/").orderByKey().once("value", snap => { 
         
        //if user.uid does not exist in db/users 
        if (snap.val()[user.uid] == undefined) {
         //add the user to the db
         console.log("user not found, adding user to database...")
         db.ref("users/").child(user.uid).set({
           displayImage: user.photoURL,
           email: user.email,
           name: user.displayName
         })
        } else {
         console.log("user already exists");
        } 
      });
  
    } else {
      //User is signed out.
      loginDiv.style.display = "block";
      
      displayCurrentUser.removeChild(document.getElementById("h3DisplayName"));
      displayCurrentUser.removeChild(document.getElementById("imgUserPhoto"));
      
      //TODO hide rest of page, add this when adding the html structure
      displayCurrentUser.style.display = "none";

    }
  });
  
  //Sign in
  firebase.auth().getRedirectResult().then(result => {            
    if (result.credential) {
      console.log("Sign in success!");
    }     
      
    }).catch(fail => {
      console.log("Sign in failed");
    });

  btnSignInFacebook.addEventListener("click", () => {   
    firebase.auth().signInWithRedirect(providerFb);
  });
  
  //Sign out
  btnSignOut.addEventListener("click", outlog => {
    firebase.auth().signOut().then( result => {
      console.log("Sign out success!");
    }).catch( fail => {
      console.log("Sign out failed");
    })        
  });
});