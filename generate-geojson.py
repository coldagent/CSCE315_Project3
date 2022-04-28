import requests
import json 


"""
    This file generates a geojson to create the dataset points for national park service icons.
    This file isn't to be used in the app and is to be ran by itself

"""

key = "eaNQAFmAdPAxZWJVm5PBBJm4PuKfAVEHny81yaah"
parkInfo = []


""" 
    Get the data from the national park Service
"""
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


geojsonPointArray = []


for index in range(len(parkInfo)):
    coords = parkInfo[index][0]
    parkCode = parkInfo[index][1]

    geojsonPoint = {
        "geometry": {
            "coordinates": coords[::-1],
            "type": "Point"
        },
        "type": "Feature",
        "properties": {
            "parkCode": parkCode
        }
    }
    geojsonPointArray.append(geojsonPoint)


geojsonFeatureCollection = {
    "type": "FeatureCollection",
    "features":[]
}


geojsonFeatureCollection["features"] = geojsonPointArray

jsonObject = json.dumps(geojsonFeatureCollection)


file = open("nationalparks.geojson", "w")
file.write(jsonObject)
file.close()

