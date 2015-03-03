import json
from pprint import pprint
import requests
import sys

# Eventful API token
API_TOKEN = "PLf4Fb5VKxJsKS9J"
# Our Django server auth token. CHANGE THIS
AUTH_TOKEN = "7ab08a3627e9da4e8c4b76856a4b792926cc065d"

URL = "http://api.eventful.com/json/events/search?app_key={}&keywords=music&location=Victoria+BC&date=Future&page_size=200".format(API_TOKEN)
POST_URL = "http://127.0.0.1:8000/events/"

response = requests.get(URL)
body = response.json()

headers={'Authorization': 'Token {}'.format(AUTH_TOKEN), \
		'content-type': 'application/json'}

if not body.get("events") and not body.get("events").get("event"):
	sys.exit(0)

created_count = 0

for event in body["events"]["event"]:
	d = {}
	d["name"] = event.get("title")
	d["description"] = event.get("description")
	d["creator"] = 1
	d["start_date"] = event.get("start_time")
	d["end_date"] = event.get("stop_time")
	d["tags"] = [{"name": "Music"}]

	response = requests.post(POST_URL, data=json.dumps(d), headers=headers)
	if response.status_code == 201:
		created_count += 1

print ("Created {} events!".format(created_count))
