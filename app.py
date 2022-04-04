import requests
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)


startLocation = ""
endLocation = ""

"""
   !!! Don't store values returned from forward geo encoding, its against EULA (like in database and such, thats a no-no) !!!

   Parameters: 

      location: string | name of the location being searched 

   returns [float, float] the coordinates of the most relevant location
"""
@app.context_processor
def Utility_Processor():
   def LocToGeoCoords(location):
      # Setup request
      websiteSource = "https://api.mapbox.com/geocoding/v5"
      endPoint = "mapbox.places"
      accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZnIxczI0MDZtaTNpbjl0bGlzYjZibyJ9.a-nfmMP6FruqBlSzx9uQOg" 
      htmlRequest = "{}/{}/{}.json?access_token={}".format(websiteSource, endPoint, str(location).replace(' ','+').replace(',', "%2C"), accessToken)

      # Process response
      response = requests.get(htmlRequest)
      results = response.json()
      features = results.get("features")
      coordinates = features[0].get("geometry").get("coordinates")
      print(coordinates)
      return coordinates

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
      accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZnIxczI0MDZtaTNpbjl0bGlzYjZibyJ9.a-nfmMP6FruqBlSzx9uQOg"
      htmlRequest = "{}/{}/{};{}?geometries=geojson&access_token={}".format(websiteSource, travelMethod, ",".join(str(x) for x in startCoord), ",".join(str(x) for x in endCoord), accessToken)

      # Process response
      response = requests.get(htmlRequest).json()

      # Should make a function here that directs to an error page for if status_code != 200 (indicates error but 200 can also represent potenetial issues)
         #print(response.status_code)
      return response.get("waypoints")
   return dict(LocToGeoCoords = LocToGeoCoords, GetRoute = GetRoute)

def LocToGeoCoords(location):
      # Setup request
      websiteSource = "https://api.mapbox.com/geocoding/v5"
      endPoint = "mapbox.places"
      accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZnIxczI0MDZtaTNpbjl0bGlzYjZibyJ9.a-nfmMP6FruqBlSzx9uQOg" 
      htmlRequest = "{}/{}/{}.json?access_token={}".format(websiteSource, endPoint, str(location).replace(' ','+').replace(',', "%2C"), accessToken)

      # Process response
      response = requests.get(htmlRequest)
      results = response.json()
      features = results.get("features")
      coordinates = features[0].get("geometry").get("coordinates")
      print(coordinates)
      return coordinates


@app.route("/update-location")
def UpdateLocations():
   startLocation = request.args.get('start')
   endLocation = request.args.get('end')
   geoCoords = [LocToGeoCoords(startLocation), LocToGeoCoords(endLocation)]
   return jsonify({"result": geoCoords})


@app.context_processor
def SubmitRouteQuery():
   print("submitted")
   return dict(SubmitRouteQuery = "submitted")


@app.route('/')
def page1():
   return render_template('page1.html')


@app.route('/page2')
def page2():
   return render_template('page2.html')
if __name__ == '__main__':
   app.run(debug=True)
