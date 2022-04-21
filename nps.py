from cmath import sqrt
import requests
from flask import jsonify, request


key = "eaNQAFmAdPAxZWJVm5PBBJm4PuKfAVEHny81yaah"
parkInfo = []



def FillParkData():
    # Setup request
    websiteSource = "https://developer.nps.gov/api/v1"
    htmlRequest = "{}/parks?limit=466&api_key={}".format(websiteSource, key)

    response = requests.get(htmlRequest).json()

    data = response.get("data")

    for park in data:
        coordsString = park.get("latLong").strip().replace("lat:", "").replace("long:", "").split(',')
        code = park.get("parkCode")
        coords = [float(x) for x in coordsString]
        parkInfo.append((coords, code))

    return jsonify(parkInfo)






def FindClosestPark():
    # Default limit = 1 to return closest park
    coord = request.args.get("coord").strip("[]").split(",")
    limit = request.args.get("limit", 1)
    if(len(parkInfo) == 0):
        return jsonify("error")
    
    shortestValueIndex = 0
    shortestDistance = sqrt(pow((coord[0] - parkInfo[0].first()), 2) + pow(coord[1] - parkInfo[0].second(), 2))
    print(shortestDistance)

    return jsonify(shortestDistance)

