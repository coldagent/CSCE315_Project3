//initialize map, the style, and starting position:
startCoord = [];
cookieStartCoord = getCookie("startCoord").split(",");
startCoord[0] = parseFloat(cookieStartCoord[0]);
startCoord[1] = parseFloat(cookieStartCoord[1]);
endCoord = [];
cookieEndCoord = getCookie("endCoord").split(",");
endCoord[0] = parseFloat(cookieEndCoord[0]);
endCoord[1] = parseFloat(cookieEndCoord[1]);
totalDistance();
mapCenterCoord = [];
mapCenterCoord[0] = (startCoord[0] + endCoord[0]) / 2;
mapCenterCoord[1] = (startCoord[1] + endCoord[1]) / 2;


mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxYzZrdnJwMDRwODNib25qNHhrd2M4biJ9.pa9g1eB2KB_7PlqW-oT7Ew';
const map = new mapboxgl.Map({
     container: 'map',
     style: 'mapbox://styles/siresquiregoat/cl23z7yxp000q15mss6lfn7x5',
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

// function makes a directions request 
// highlights the route
async function getRoute(end) {

     // I replaced the query to map box with the query to our internal API  - ERIK (when I tested it worked fine)
     const query = await fetch(
          window.location.origin + `/api/get-route?start=[${startCoord[0]},${startCoord[1]}]&end=[${end[0]},${end[1]}]`,
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
// on map load, mark the start and end coordinates
map.on('load', () => {
     getRoute(endCoord);

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
     for (let i = 0; i < ca.length; i++) {
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

//opens tab onclick
// function openActivities(evt, cityName) {
//      var i, tabcontent, tablinks;
//      tabcontent = document.getElementsByClassName("tabcontent");
//      for (i = 0; i < tabcontent.length; i++) {
//           tabcontent[i].style.display = "none";
//      }
//      tablinks = document.getElementsByClassName("tablinks");
//      for (i = 0; i < tablinks.length; i++) {
//           tablinks[i].className = tablinks[i].className.replace(" active", "");
//      }
//      document.getElementById(cityName).style.display = "block";
//      evt.currentTarget.className += " active";
// }

// adds markers to route using "coordinate" array from API 
// makes sure coordinates are not too close together
// tests the forecast of each coordinate and prints the appropriate weather icon
async function markerFunc(coordArray) {
     let prevMark = 0;
     for (let i = 0; i < coordArray.length; i++) {
          if (i > 0) {
               coordPrev = coordArray[prevMark];
               coordI = coordArray[i];
               
               longDiffMeters = Math.abs(coordPrev[0] - coordI[0]) * 111139;
               latDiffMeters = Math.abs(coordPrev[1] - coordI[1]) * 111139;
               distMeters = Math.sqrt(Math.pow(longDiffMeters, 2) + Math.pow(latDiffMeters, 2));

               if (distMeters > 100000) { //add tot distance to parameter and calculate the space distance btwn markers
                    //console.log("if");
                    coordPrev = coordArray[prevMark];
                    coordI = coordArray[i];
                    //console.log(coordPrev[0] + " == " + coordI[0]);
                    prevMark = i;
                    const marker = {
                         'type': 'Feature',
                         'properties': {
                              'iconSize': [40, 40]
                         },
                         'geometry': {
                              'type': 'Point',
                              'coordinates': coordArray[i]
                         }
                    };

                    // Create a DOM element for each marker.
                    const el = document.createElement('div');
                    const width = marker.properties.iconSize[0];
                    const height = marker.properties.iconSize[1];
                    const sunnyWords = ['Sunny', 'Clear','Fair'];
                    const cloudyWords = ['Cloud', 'Overcast'];
                    const rainyWords = ['Rain', 'Drizzle','Shower'];
                    const snowWords = ['Freezing', 'Ice','Snow', 'Hail'];
                    const thunderstormWords = ['Thunderstorm'];

                    el.className = 'marker';
                    (async () => {await fetch(window.location.origin + "/api/forecast?coord=" + coordArray[i] )
                    .then(response => response.json())
                    .then(result => {
                         if (thunderstormWords.some(thunderstormWords => (result.result).includes(thunderstormWords))) {
                              //el.style.backgroundImage = `url(https://www.pngitem.com/pimgs/m/18-186328_transparent-smiley-face-clipart-sunny-clipart-hd-png.png)`;
                              el.style.backgroundImage = `url(${window.location.origin}/static/thunderstorm-icon.png)`;
                         }
                         else if (snowWords.some(snowWords => (result.result).includes(snowWords))) {
                              //el.style.backgroundImage = `url(https://www.pngitem.com/pimgs/m/18-186328_transparent-smiley-face-clipart-sunny-clipart-hd-png.png)`;
                              el.style.backgroundImage = `url(${window.location.origin}/static/snow-icon.png)`;
                         }
                         else if (rainyWords.some(rainyWords => (result.result).includes(rainyWords))) {
                              //el.style.backgroundImage = `url(https://www.pngitem.com/pimgs/m/18-186328_transparent-smiley-face-clipart-sunny-clipart-hd-png.png)`;
                              el.style.backgroundImage = `url(${window.location.origin}/static/rain-icon.png)`;
                         }
                         else if (cloudyWords.some(cloudyWords => (result.result).includes(cloudyWords))) {
                              //el.style.backgroundImage = `url(https://www.pngitem.com/pimgs/m/18-186328_transparent-smiley-face-clipart-sunny-clipart-hd-png.png)`;
                              el.style.backgroundImage = `url(${window.location.origin}/static/cloudy-icon.png)`;
                         }
                         else if (sunnyWords.some(sunnyWords => (result.result).includes(sunnyWords))){
                              //el.style.backgroundImage = `url(https://toppng.com//public/uploads/preview/image-grey-cloud-clipart-11562970825nsz4l7vplv.png)`;
                              el.style.backgroundImage = `url(${window.location.origin}/static/sunny-icon.png)`;
                         }
                         else {
                         }
                    }).catch(error => {
                         console.log(error);
                    });})()

                    await getParks(coordArray[i]);

                    
                    
                    el.style.width = `${width}px`;
                    el.style.height = `${height}px`;
                    el.style.backgroundSize = '100%';

                    // Add markers to the map.
                    new mapboxgl.Marker(el)
                         .setLngLat(marker.geometry.coordinates)
                         .addTo(map);
               }
          }
     }
}

//api call to get-route
// calculates total distance 
// calls markerFunc and sends coordinates array along the route
async function totalDistance() {
     fetch(window.location.origin + "/api/get-route?start=[" + startCoord + "]&end=[" + endCoord + "]")
          .then(response => response.json())
          .then(result => {
               distance = result['routes'][0]['distance']; //meters
               markerFunc(result['routes'][0]['geometry']['coordinates']);
               console.log(set);

               //return set;
          }).catch(error => {
               return "error"
          });
}

var addedParks = [];
async function getParks(coordIn) {
     fetch(window.location.origin + "/api/get-park-code?coord=[" + coordIn + "]")
          .then(response => response.json())
          .then(result => {
               res = String(result.result);
               if (addedParks.indexOf(res) == -1){
                    var ul = document.getElementById("dynamic-list");
                    //var candidate = document.getElementById("candidate");
                    var li = document.createElement("li");
                    li.setAttribute('id',result.result);
                    li.appendChild(document.createTextNode(result.result));
                    ul.appendChild(li);
                    addedParks.push(res);
               }
          }).catch(error => {
               return "error"
          });
}


//distance = result['routes'][0]['distance']; //meters
//duration = result['routes'][0]['duration']; //minutes