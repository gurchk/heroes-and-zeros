function hideLoadingScreen() {
    let loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.add("hidden");
}

function showLoadingScreen() {
    let loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.remove("hidden");
}

function updateUI(name, avatar, coins) {
    document.getElementById("username").innerText = name;
    document.getElementById("avatar").setAttribute("src", avatar);
    document.getElementById("coins").innerHTML = coins + "<i class='material-icons'>high_quality</i>";

    loginWrapper.classList.add("hidden");
    contentWrapper.classList.remove("hidden");

    loginFinished();
    hideLoadingScreen();
}
