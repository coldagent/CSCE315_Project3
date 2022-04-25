from math import sqrt
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

    if(len(parkInfo) == 0):
        FillParkData()

    # Default limit = 1 to return closest park
    coord = request.args.get("coord").strip("[]").split(",")
    limit = request.args.get("limit", 1)
    if(len(parkInfo) == 0):
        return jsonify("error")

    limit = max(int(limit), 0)
    limit = min(limit, len(parkInfo))

    distMatrix = []
    sampleCoord = [float(x) for x in coord]


    for index in range(0, len(parkInfo)):
        parkCoord = parkInfo[index][0]
        xDiff = pow(sampleCoord[0] - parkCoord[0], 2)
        yDiff = pow(sampleCoord[1] - parkCoord[1], 2)
        dist = sqrt(xDiff + yDiff)
        distMatrix.append((dist, parkInfo[index][1]))


    distMatrix.sort()
    print(limit)
    returnData = [distMatrix[index][1] for index in range(0, limit)]


    return jsonify(returnData)

