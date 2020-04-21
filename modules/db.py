from pymongo import MongoClient
from bson.objectid import ObjectId
import yaml
from os.path import dirname, join
from urllib.request import urlopen
import hashlib
from icalendar import Calendar, Event
import os, time
from calendar import *
import re

file = open(join(dirname(__file__), "../private/config.yml"))

data = yaml.load(file.read(), Loader=yaml.SafeLoader)['db']

def create_client():
    client = MongoClient(
            data['host'] + ':' + str(data['port']),
            username=data['user'],
            password=data['password'],
            authSource=data['dbName']
    )

    return client[data['dbName']]

db = create_client()

def check_for_changes():
    url = "https://calendar.google.com/calendar/ical/oc7b32uiqmg7f063or4n1tmdkk%40group.calendar.google.com/private-9c9790cd2613d41bc9c3d1a51831d430/basic.ics"
    ical = urlopen(url).read()
    cal = Calendar.from_ical(ical)

    ical_str = ical.decode()
    ical_str = re.sub(r'DTSTAMP:.*\r\n', '', ical_str)

    sha256 = hashlib.sha256()
    sha256.update(ical_str.encode())

    new_hash = sha256.digest()

    # print(str(new_hash))

    old_hash = db.hashes.find_one({'name': 'latest'})

    # print(ical_str)

    if (new_hash != old_hash['hash']):
        db.hashes.find_one_and_update({'_id': old_hash['_id']}, {
            "$set": {"hash": new_hash}
        })
        pid = os.fork()
        if pid == 0:
            update_database(cal, new_hash)
            os._exit(0)
        else:
            return 1
    else:
        print("No changes")
        return 0

def update_database(cal, new_hash):
    client = create_client()
    print("Updating database...\n")
    insert_list = []
    for component in cal.walk():
        if component.name == "VEVENT": # If the thing is an event
            insert_list.append(make_dict(component))

    client.events.delete_many({})
    client.events.insert_many(insert_list)
    client.hash.update_one({"name": "latest"}, {"$set": {"hash": new_hash}})

if __name__ == "__main__":
    check_for_changes()
