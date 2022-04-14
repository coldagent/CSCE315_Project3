//initialize map, the style, and starting position:
startCoord = [];
cookieStartCoord = getCookie("startCoord").split(",");
startCoord[0] = parseFloat(cookieStartCoord[0]);
startCoord[1] = parseFloat(cookieStartCoord[1]);
endCoord = [];
cookieEndCoord = getCookie("endCoord").split(",");
endCoord[0] = parseFloat(cookieEndCoord[0]);
endCoord[1] = parseFloat(cookieEndCoord[1]);
weatherPoints();
mapCenterCoord = [];
mapCenterCoord[0] = (startCoord[0] + endCoord[0]) / 2;
mapCenterCoord[1] = (startCoord[1] + endCoord[1]) / 2;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxYzZrdnJwMDRwODNib25qNHhrd2M4biJ9.pa9g1eB2KB_7PlqW-oT7Ew';
const map = new mapboxgl.Map({
     container: 'map',
     style: 'mapbox://styles/siresquiregoat/cl1c6np0n000314o2vc7wp96g',
     center: mapCenterCoord
});
//bounds of the map
lowerBound = [];
lowerBound[0] = Math.min(startCoord[0], endCoord[0]) - 0.5;
lowerBound[1] = Math.min(endCoord[1], startCoord[1]) - 0.5;
upperBound = [];
upperBound[0] = Math.max(startCoord[0], endCoord[0]) + 0.5;
upperBound[1] = Math.max(endCoord[1], startCoord[1]) + 0.5;

const bounds = [lowerBound, upperBound];
map.fitBounds(bounds);

// function makes a directions request //uses cycling profile for now
async function getRoute(end) {

     const query = await fetch(
     `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoord[0]},${startCoord[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
     { method: 'GET' }
     );
     const json = await query.json();
     const data = json.routes[0];
     const route = data.geometry.coordinates;
     const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
               type: 'LineString',
               coordinates: route
          }
     };
     // if the route already exists on the map, we'll reset it using setData
     if (map.getSource('route')) {
          map.getSource('route').setData(geojson);
     }
     // otherwise, make a new request
     else {
          map.addLayer({
               id: 'route',
               type: 'line',
               source: {
               type: 'geojson',
               data: geojson
               },
               layout: {
               'line-join': 'round',
               'line-cap': 'round'
               },
               paint: {
               'line-color': '#3887be',
               'line-width': 5,
               'line-opacity': 0.75
               }
          });
     }
}
map.on('load', () => {
     getRoute(endCoord);

     // Add starting point to the map
     map.addLayer({
          id: 'markStart',
          type: 'circle',
          source: {
               type: 'geojson',
               data: {
               type: 'FeatureCollection',
               features: [
                    {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                    type: 'Point',
                    coordinates: startCoord
                    }
                    }
               ]
               }
          },
          paint: {
               'circle-radius': 10,
               'circle-color': '#3887be'
          }
     });
     map.addLayer({
          id: 'markEnd',
          type: 'circle',
          source: {
          type: 'geojson',
          data: {
               type: 'FeatureCollection',
               features: [
               {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                         type: 'Point',
                         coordinates: endCoord
               }
               }
               ]
          }
          },
          paint: {
          'circle-radius': 10,
          'circle-color': '#f30'
          }
     });
});

//parses all cookie to get the cookie with cname
function getCookie(cname) {
     let name = cname + "=";
     let decodedCookie = decodeURIComponent(document.cookie);
     let ca = decodedCookie.split(';');
     for(let i = 0; i <ca.length; i++) {
       let c = ca[i];
       while (c.charAt(0) == ' ') {
         c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
       }
     }
     return "";
}


function openActivities(evt, cityName) {
     var i, tabcontent, tablinks;
     tabcontent = document.getElementsByClassName("tabcontent");
     for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
     }
     tablinks = document.getElementsByClassName("tablinks");
     for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
     }
     document.getElementById(cityName).style.display = "block";
     evt.currentTarget.className += " active";
}

function weatherPoints() {
     //document.getElementById("testhere").innerHTML = cookieStartCoord;
     //
     // fetch(window.location.origin + "/api/get-route?start=[" + startCoord + "]&end=[" + endCoord + "]")
     // .then(response => response.json())
     // .then(result => {
     //      distance = result['routes'][0]['distance']; //meters
     //      //duration = result['routes'][0]['duration']; //minutes
     //      document.getElementById("testhere").innerHTML = distance;
     //      //return distance;
     // }).catch(error => {
     //      document.getElementById("testhere").innerHTML = "error";
     // });
     fetch(window.location.origin + "/api/forecast?coord=[" + startCoord + "]")
     .then(response => response.json())
     .then(result => 
          //distance = result['routes'][0]['distance']; //meters
          //duration = result['routes'][0]['duration']; //minutes
          document.getElementById("testhere").innerHTML = result.result
          
          //return distance;
     ).catch(error => {
          document.getElementById("testhere").innerHTML = "error"
     });
}