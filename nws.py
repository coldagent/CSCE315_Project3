import requests
from flask import jsonify, request

""" Needed for authentication to nws api (although only for security events) """
userAgent = "User-Agent: (route-out.herokuapp.com, eriktpriest@gmail.com)"



"""
Parameters: 

   coord: [float, float] | coordinates for weather location query in form [longitude, latitude]

   returns json of NWS zone Response
"""
def GetForecastZoneByCoords():
   # Get coords from api call
   coord = request.args.get("coord").strip("[]").replace(" ","").split(",")[::-1]

   # Setup request
   htmlRequest = "https://api.weather.gov/points/{},{}".format(coord[0], coord[1])

   # Process response
   response = requests.get(htmlRequest)   

   return response.json()




"""
Parameters: 

   coord: [float, float] | coordinates for weather location in form [longitude, latitude] (passed into GetForecastZoneByCoords)

   returns json of NWS daily weather report (up to week)
"""
def GetForecast():

   # Determine what zone for forecasting is
   zoneJson = GetForecastZoneByCoords()

   # Returns string of api call to get forecast
   forecastString = zoneJson.get("properties").get("forecast")

   response = requests.get(forecastString)

   if(response.ok):
      periods = response.json().get("properties").get("periods")
      shortFore = periods[0].get("shortForecast")
      return jsonify(result = shortFore)
   
   return jsonify(result = "")



"""
Parameters: 

   coord: [float, float] | coordinates for weather location in form [longitude, latitude] (passed into GetForecastZoneByCoords)

   returns json of NWS hourly weather report (up to 24 hours)
"""
def GetForecastHourly():
   # Determine what zone for forecasting is
   zoneJson = GetForecastZoneByCoords()

   # Returns string of api call to get forecast
   forecastString = zoneJson.get("properties").get("forecastHourly")

   response = requests.get(forecastString).json()

   return response
