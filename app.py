import requests
from flask import Flask, render_template, request, jsonify, make_response
from mapbox import LocToGeoCoords
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
@app.route("/api/forecast")
def GetForecast():
   return nws.GetForecast()


@app.route("/api/forecast-hourly")
def GetForecastHourly():
   return nws.GetForecastHourly()


@app.route("/api/get-coords")
def GetCoords():
   return mapbox.LocToGeoCoords()


@app.route("/api/get-route")
def GetRoute():
   return mapbox.CalcRoute()

@app.route("/api/park-data")
def ParkData():
   nps.FillParkData()
   return nps.FindClosestPark()



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
