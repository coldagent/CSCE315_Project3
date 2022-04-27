import requests
from flask import Flask, render_template, request, jsonify, make_response
app = Flask(__name__)

"""
   Local dependicies
"""
import mapbox 
import nws
import nps




"""
   API Routing Calls
"""
"""
      National Weather Service API
"""
@app.route("/api/forecast")
def GetForecast():
   return nws.GetForecast()

@app.route("/api/forecast-hourly")
def GetForecastHourly():
   return nws.GetForecastHourly()


"""
      MapBox API
"""
@app.route("/api/get-coords")
def GetCoords():
   return mapbox.LocToGeoCoords()

@app.route("/api/get-route")
def GetRoute():
   return mapbox.CalcRoute()


"""
      National Park Service API
"""
@app.route("/api/get-park-code")
def GetParkData():
   return nps.FindClosestPark()

@app.route("/api/get-park-activities")
def GetParkActivities():
   return nps.GetParkActivities()

@app.route("/api/get-park-info")
def GetParkInformation():
   return nps.GetParkInformation()





"""
   Render template calls
"""
@app.route('/')
def page1():
   return render_template('page1.html')


@app.route('/plan')
def page2():
   return render_template('page2.html')
if __name__ == '__main__':
   app.run(debug=True)
