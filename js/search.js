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
// on every bet, 
function filterByQuery(query) {
    db.ref("bets/").on("child_added", snapshot => {
        let bet = snapshot.val();
        let key = snapshot.key;
        let listOfBets = document.getElementsByClassName("bet");
        //only show active bets
        if (bet.active) {
            //if the title of the bet is the same as the query searched for
            if (bet.title == query) {
                //remove the hidden class from the elements with matching id's
                for (let i = 0; i<listOfBets.length; i++) {
                    if (listOfBets[i].dataset.id == key) {
                        listOfBets[i].classList.remove("hidden");
                    }
                }
            };
        }
    });
};

//let listOfBets = getTagsByAttributes("data-id", "div");
////Choose attribute and the tag you want to select (optional), if omitted selects all tags
//function getTagsByAttributes(attribute, tag="*") {
//    let matchingElements = [];
//    let chosenElements = document.getElementsByTagName(tag);
//    for (let i = 0; i<chosenElements.length; i++) {
//        if (chosenElements[i].getAttribute(attribute) != null) {
//            matchingElements.push(chosenElements[i]);    
//        }
//    }
//    return matchingElements;
//}
