
// When "pg1-submit" button is clicked, the text box values are sent to flask
document.getElementById("pg1-submit").addEventListener("click", function(e) {
     let start = document.getElementById("text1").value;
     let end = document.getElementById("text2").value;
     
     fetch('http://127.0.0.1:5000/update-location?start=' + start + '&end=' + end)
       .then((response) => {
         return response.json();
       })
       .then((myJson) => {
         document.getElementById("testoutput").innerHTML = start + " and " + end + " Coordinates: " + myJson.result;
       }).catch((error) => {
            let fakeJSON = {
           result: start + end
         } // Only added to simulate
         document.getElementById("testoutput").innerHTML = start + " and " + end + " Coordinates: " + fakeJSON.result;
       });
});
   