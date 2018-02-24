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
  let providerFb = new firebase.auth.FacebookAuthProvider();
  let btnSignInFacebook = document.getElementById("btnSignInFacebook");
  
  //Redirect to app.html after login
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      location.href = "app.html";
    }
  });
  
  //Sign in user
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
  
});   
