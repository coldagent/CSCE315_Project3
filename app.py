import requests
from flask import Flask, render_template, request
app = Flask(__name__)


"""
   Parameters: 

      startCoord: [float, float] | coordinates for start location in form [longitude, latitude]
      endCoord: [float, float]   | coordinates for start location in form [longitude, latitude]

   returns array of waypoint objects (refer to https://docs.mapbox.com/api/navigation/directions/#waypoint-object for waypoint objects)
"""
def GetRoute(startCoord, endCoord):
   # Setup request
   websiteSource = "https://api.mapbox.com/directions/v5/mapbox"
   travelMethod = "driving"
   accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZjFraDExMHZnZDNqcGNud2I4eHRxdCJ9.f1ClrGFoSR0NeuKWmyo3oQ"
   htmlRequest = "{}/{}/{};{}?geometries=geojson&access_token={}".format(websiteSource, travelMethod, ",".join(str(x) for x in startCoord), ",".join(str(x) for x in endCoord), accessToken)

   # Process response
   response = requests.get(htmlRequest)

   # Should make a function here that directs to an error page for if status_code != 200 (indicates error but 200 can also represent potenetial issues)
      #print(response.status_code)
   return response.get("waypoints")



"""
   !!! Don't store values returned from forward geo encoding, its against EULA (like in database and such, thats a no-no) !!!

   Parameters: 

      location: string | name of the location being searched 

   returns [float, float] the coordinates of the most relevant location
"""
def LocToGeoCoords(location):
   # Setup request
   websiteSource = "https://api.mapbox.com/geocoding/v5"
   endPoint = "mapbox.places"
   accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZjFraDExMHZnZDNqcGNud2I4eHRxdCJ9.f1ClrGFoSR0NeuKWmyo3oQ" 
   htmlRequest = "{}/{}/{}.json?access_token={}".format(websiteSource, endPoint, str(location).replace(' ','+').replace(',', "%2C"), accessToken)

   # Process response
   response = requests.get(htmlRequest)
   results = response.json()
   features = results.get("features")
   coordinates = features[0].get("geometry").get("coordinates")
   print(coordinates)
   return coordinates



@app.route('/')
def page1():
   # Dummy coords until we get a way to read user inputs workflow should be get start (str), end (str) then do GetRoute( LocToGeoCoords(start) , LocToGeoCoords(end) ) 
   startCoord = [-96.325851, 30.622370] # College Station
   endCoord = [-95.358421, 29.749907] # Houston

   GetRoute(startCoord, endCoord)
   LocToGeoCoords("College Station, Texas")

   return render_template('page1.html')


@app.route('/page2')
def page2():
   return render_template('page2.html')
if __name__ == '__main__':
   app.run(debug=True)
