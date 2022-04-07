import requests
from flask import Flask, render_template, request, jsonify, make_response
app = Flask(__name__)


"""
   Callable URL functions
"""


"""
   !!! Don't store values returned from forward geo encoding, its against EULA (like in database and such, thats a no-no) !!!

   Parameters: 

      loc: string | name of the location being searched 

   returns [float, float] the coordinates of the most relevant location
"""
@app.route("/api/get-coords", methods = ['GET', 'POST'])
def LocToGeoCoords():
   location = request.args.get("loc")

   print(location)

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
   return jsonify(result = coordinates)



"""
Parameters: 

   startCoord: [float, float] | coordinates for start location in form [longitude, latitude]
   endCoord: [float, float]   | coordinates for end location in form [longitude, latitude]

   returns geojson
"""
@app.route("/api/get-route")
def GetRoute():

   startCoord = request.args.get("start").strip("[]").split(",")
   endCoord = request.args.get("end").strip("[]").split(",")

   # Setup request
   websiteSource = "https://api.mapbox.com/directions/v5/mapbox"
   travelMethod = "driving"
   accessToken = "sk.eyJ1Ijoic2lyZXNxdWlyZWdvYXQiLCJhIjoiY2wxZnIxczI0MDZtaTNpbjl0bGlzYjZibyJ9.a-nfmMP6FruqBlSzx9uQOg"
   htmlRequest = "{}/{}/{};{}?geometries=geojson&access_token={}".format(websiteSource, travelMethod, ",".join(str(x) for x in startCoord), ",".join(str(x) for x in endCoord), accessToken)

   # Process response
   response = requests.get(htmlRequest).json()

   # Should make a function here that directs to an error page for if status_code != 200 (indicates error but 200 can also represent potenetial issues)
   return response



"""
   Render template calls
"""
@app.route('/')
def page1():
   return render_template('page1.html')


@app.route('/page2')
def page2():
   return render_template('page2.html')
if __name__ == '__main__':
   app.run(debug=True)
