
// When "pg1-submit" button is clicked, 
//start and end coords are saved to cookie
document.getElementById("pg1-submit").addEventListener("click", function(e) {
    let start = document.getElementById("text1").value;
    let end = document.getElementById("text2").value;


    fetch("http://127.0.0.1:5000/api/get-coords?loc=" + start)
    .then(response => response.json())
    .then(result => {
        SetCookie("startCoord", result.result, 1);
    }).catch(error => {
        document.getElementById("testGetCookieError").innerHTML = "error set cookie";
    })

    fetch("http://127.0.0.1:5000/api/get-coords?loc=" + end)
    .then(response => response.json())
    .then(result => {
        SetCookie("endCoord", result.result, 1);
        window.location.href = "/page2";
    }).catch(error => {
        document.getElementById("testGetCookieError").innerHTML = "error set cookie";
    });
});


//cname = string, cvalue = string, exdays = int
//cookie will expire after exdays
function SetCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}