// websiteadress/?search=value

// Parse the URL parameter
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;    
    } 
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function search() {
    // Give the parameter a variable name
    let searchQuery = getParameterByName('search');

    if (searchQuery != null) {
        //show only the bets who pass the filter
        filterByQuery(searchQuery);
    } else {
        console.log("The url string is empty")
        //show all bets
        let allBetsHtmlArr = document.getElementsByClassName("bet");
        
        for (let i=0; i<allBetsHtmlArr.length; i++) {
            allBetsHtmlArr[i].classList.remove("hidden");
        }
    }
}

function filterByQuery(query) {
    db.ref("bets/").on("child_added", snapshot => {
        let bet = snapshot.val();
        //only show active bets
        if (bet.active) {
            if (bet.title == query) {
                document.getElementsByClassName("bet")[0].classList.remove("hidden");
            };
        }
    });
};
