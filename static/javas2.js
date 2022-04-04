//initialize map, the style, and starting position:
startCoord = [];
startCoord[0] = -97.325851;
startCoord[1] = 30.622370;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxYzZrdnJwMDRwODNib25qNHhrd2M4biJ9.pa9g1eB2KB_7PlqW-oT7Ew';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/siresquiregoat/cl1c6np0n000314o2vc7wp96g',
center: startCoord,
zoom: 12
});
//bounds of the map
lowerBound = [];
lowerBound[0] = startCoord[0] - 0.5;
lowerBound[1] = startCoord[1] - 0.5;
upperBound = [];
upperBound[0] = startCoord[0] + 0.5;
upperBound[1] = startCoord[1] + 0.5;

const bounds = [lowerBound, upperBound];
map.setMaxBounds(bounds);

// function makes a directions request //uses cycling profile for now
async function getRoute(end) {

     const query = await fetch(
     `https://api.mapbox.com/directions/v5/mapbox/cycling/${startCoord[0]},${startCoord[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
     // make an initial directions request that
     // starts and ends at the same location
     getRoute(startCoord);

     // Add starting point to the map
     map.addLayer({
     id: 'point',
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
     //lets user click on the map to update destination location
     map.on('click', (event) => {
          const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
          const end = {
          type: 'FeatureCollection',
          features: [
               {
               type: 'Feature',
               properties: {},
               geometry: {
                    type: 'Point',
                    coordinates: coords
               }
               }
          ]
          };
          if (map.getLayer('end')) {
          map.getSource('end').setData(end);
          } else {
          map.addLayer({
               id: 'end',
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
                         coordinates: coords
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
          }
          getRoute(coords);
     });
});


   
