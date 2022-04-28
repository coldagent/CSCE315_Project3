from math import sqrt
import requests
from flask import jsonify, request


key = "eaNQAFmAdPAxZWJVm5PBBJm4PuKfAVEHny81yaah"
parkInfo = []


"""
    Fills up a local array with park info in the format
        ([latitude, longitude], "parkCode") | ([float, float], string)

    No parameters
"""
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


"""
    Returns a json array of the closest park parkCodes (in unitless coord distance) based on a pass in coordinate
        with an optional value for the number of values wanted (limit)
"""
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
    returnData = [distMatrix[index][1] for index in range(0, limit)]


    return jsonify(result = returnData)



def GetParkActivities():

    if(len(parkInfo) == 0):
        FillParkData()

    # Get parameters
    parkCode = request.args.get("park-code")

    # Set up request
    websiteSource = "https://developer.nps.gov/api/v1"
    htmlRequest = "{}/thingstodo?parkCode={}&api_key={}".format(websiteSource, parkCode, key)

    response = requests.get(htmlRequest).json()

    data = response.get("data")


    return jsonify(data)



def GetParkInformation():

    if(len(parkInfo) == 0):
        FillParkData()

    # Get parameters
    parkCode = request.args.get("park-code")

    # Set up request
    websiteSource = "https://developer.nps.gov/api/v1"
    htmlRequest = "{}/parks?parkCode={}&api_key={}".format(websiteSource, parkCode, key)

    response = requests.get(htmlRequest).json()

    data = response.get("data")

    returnData = {
        "fullName" : "",
        "url": "",
        "description": "", 
        "activities": "",
        "images": ""
    }

    returnData["fullName"] = data[0].get("fullName")
    returnData["url"] = data[0].get("url")
    returnData["description"] = data[0].get("description")
    returnData["activities"] = data[0].get("activities")
    returnData["images"] = data[0].get("images")
    

    return jsonify(result = returnData)

