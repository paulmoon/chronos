from googleplaces import GooglePlaces, types, lang
import json
from pprint import pprint
import requests
import sys
import time

# Google Places API
GOOGLE_PLACES_API = "AIzaSyB7MdGZKHRP-Y0aTLylAlXnEDXCZOTPIgc"
# Eventful API token
API_TOKEN = "PLf4Fb5VKxJsKS9J"
# Our Django server auth token. CHANGE THIS
AUTH_TOKEN = "115bf6b7c7ac36f18813dc0e0a98f8f3d215601c"

LOCATION = "Victoria, BC"
KEYWORDS = ["Music"]
URL = "http://api.eventful.com/json/events/search?app_key={api_token}&keywords={keywords}&location={location}&date=Future&page_size=200" \
       .format(api_token=API_TOKEN, keywords=','.join(KEYWORDS), location=LOCATION)
POST_URL = "http://127.0.0.1:8000/events/"

headers = {'Authorization': 'Token {}'.format(AUTH_TOKEN), \
            'content-type': 'application/json'}
google_places = GooglePlaces(GOOGLE_PLACES_API)
created_count = 0

response = requests.get(URL)
body = response.json()
if not body.get("events") and not body.get("events").get("event"):
	sys.exit(0)

for event in body["events"]["event"]:
        if not all([event.get("description"), event.get("start_time"), event.get("stop_time")]):
          continue

	d = {}
	d["name"] = event.get("title")
	d["description"] = event.get("description")
	d["creator"] = 1
	d["start_date"] = event.get("start_time")
	d["end_date"] = event.get("stop_time")
	d["tags"] = [{"name": "Music"}]
        
        # Get place_id and formatted_address from Google
        if event.get("latitude") and event.get("longitude") and event.get("city_name"):
          lat_lng = {"lat": event.get("latitude"), "lng": event.get("longitude")}

          autocomplete_results = google_places.autocomplete(lat_lng=lat_lng, types=types.AC_TYPE_CITIES, input=event.get("city_name"))
          if autocomplete_results.predictions:
            prediction = autocomplete_results.predictions[0]
            prediction.get_details()
            d["place_id"] = prediction.place_id
            d["place_name"] = prediction.place.formatted_address

            
	response = requests.post(POST_URL, data=json.dumps(d), headers=headers)
	if response.status_code == 201:
		created_count += 1
        elif response.status_code != 200:
                pprint(response.text)

print ("Created {} events!".format(created_count))
