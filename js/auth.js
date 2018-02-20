window.addEventListener("load", () => {
  
  //variable declaration
  let providerFb = new firebase.auth.FacebookAuthProvider();
  let btnSignInFacebook = document.getElementById("btnSignInFacebook");
  let btnSignOut = document.getElementById("btnSignOut");
  let displayCurrentUser = document.getElementById("displayCurrentUser");
  var user;
  
  btnSignInFacebook.addEventListener("click", popUp => {          
    firebase.auth().signInWithPopup(providerFb).then( result => {            
      
      //disable login, enable logout
      btnSignInFacebook.disabled = true;
      btnSignOut.disabled = false;
      
      //show div
      //displayCurrentUser.style.display = "block";
      
      //store user data
      user = result.user;

      //add h3 
      let h3UserName = document.createElement("h3");
      h3UserName.innerHTML = "Signed in as: " + user.displayName;
      displayCurrentUser.appendChild(h3UserName);

      //add img
      let imgUserPhoto = document.createElement("img");
      imgUserPhoto.setAttribute("src", user.photoURL);
      displayCurrentUser.appendChild(imgUserPhoto);

      console.log("Sign in success!");
    }).catch( fail => {
      console.log("Sign in failed");
    })
  });

  btnSignOut.addEventListener("click", outlog => {
    firebase.auth().signOut().then( result => {
      
      //enable login and disable logout
      btnSignInFacebook.disabled = false;
      btnSignOut.disabled = true;
      
      //remove userdata by setting to null
      user = null;
      
      //hide div 
      //displayCurrentUser.style.display = "none";
      
      //remove h3UserName and imgUserPhoto
      displayCurrentUser.removeChild(document.getElementsByTagName("h3")[0])
      displayCurrentUser.removeChild(document.getElementsByTagName("img")[0])

      console.log("Sign out success!");
    }).catch( err => {
      console.log("Sign out failed");
    })        
  });   
});