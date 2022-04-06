
// When "pg1-submit" button is clicked, 
//start and end coords are saved to cookie
document.getElementById("pg1-submit").addEventListener("click", function(e) {
     let start = document.getElementById("text1").value;
     let end = document.getElementById("text2").value;
     

    fetch('http://127.0.0.1:5000/get-coords?loc=' + start )
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        setCookie( "startCoord=", myJson.result, 1);
    }).catch((error) => {
        document.getElementById("testGetCookieError").innerHTML = "errorgetcookie";
    });

    fetch('http://127.0.0.1:5000/get-coords?loc=' + end )
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        setCookie( "endCoord=", myJson.result, 1);
    }).catch((error) => {
        document.getElementById("testGetCookieError").innerHTML = "errorgetcookie";
    });
    window.location.href = "/page2";

});

//cname = string, cvalue = string, exdays = int
//cookie will expire after exdays
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}