
var firstCookieDone = false;
var secondCookieDone = false;

// When "pg1-submit" button is clicked, 
//start and end coords are saved to cookie
document.getElementById("pg1-submit").addEventListener("click", function(e) {
    let start = document.getElementById("text1").value;
    let end = document.getElementById("text2").value;

    FetchCoordinates(start, end);
    CheckIfDone();
});


function FetchCoordinates(start, end){
    fetch(window.location.href + "api/get-coords?loc=" + start)
    .then(response => response.json())
    .then(result => {
        SetCookie("startCoord", result.result, 1);
        firstCookieDone = true;
        CheckIfDone();
    }).catch(error => {
        document.getElementById("testGetCookieError").innerHTML = "error set cookie";
    });

    fetch(window.location.href + "api/get-coords?loc=" + end)
    .then(response => response.json())
    .then(result => {
        SetCookie("endCoord", result.result, 1);
        secondCookieDone = true;
        CheckIfDone();
    }).catch(error => {
        document.getElementById("testGetCookieError").innerHTML = "error set cookie";
    });

    setTimeout(() => {}, 500);
}

function CheckIfDone(){
    window.location.href = "/page2";
}

//cname = string, cvalue = string, exdays = int
//cookie will expire after exdays
function SetCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}