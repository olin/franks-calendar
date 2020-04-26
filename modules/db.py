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

# Load in database information from a private file
# This makes sure that no one on GitHub can see my passwords
file = open(join(dirname(__file__), "../private/config.yml"))
data = yaml.load(file.read(), Loader=yaml.SafeLoader)['db']

# Creates a MongoDB client to access the database
def create_client():
    client = MongoClient(
            data['host'] + ':' + str(data['port']),
            username=data['user'],
            password=data['password'],
            authSource=data['dbName']
    )
    return client[data['dbName']]

db = create_client() # Create a client

def check_for_changes():
    # Step one: get the .ics file from Google
    url = "https://calendar.google.com/calendar/ical/ocrlnk9gfl2ee4shh46ffd2kgk%40group.calendar.google.com/private-50a283aa50d5e2b1108d41806b087c44/basic.ics"
    ical = urlopen(url).read() # This reads the information into a byte string
    cal = Calendar.from_ical(ical) # Create a Calendar object from our .ics file

    ical_str = ical.decode() # Get the ICS file as a string
    ical_str = re.sub(r'DTSTAMP:.*\r\n', '', ical_str) # Filter out the access timestamp
    # We filter out the access timestamp so that when we hash it,
    #we get the same result regardless of when we access it, as long as the events haven't changed

    # Create a hash of the downloaded .ics file
    sha256 = hashlib.sha256()
    sha256.update(ical_str.encode())
    new_hash = sha256.digest()

    # Retreive the old hash from the database
    old_hash = db.hashes.find_one({'name': 'latest'})

    if (new_hash != old_hash['hash']):
        # If they're different, fork a new process to run separately and update the database
        pid = os.fork()
        if pid == 0:
            # This chunk will only execute for the child process
            update_database(cal, new_hash) # Calls the update_database func
            os._exit(0) # and then exits
        else:
            # This code will only execute for the parent process
            # We should just return
            return 0
    else:
        # If there are no changes, we're all good
        print("No changes")
        return 0

def update_database(cal, new_hash):
    client = create_client() # Create a new client for the child process
    print("Updating database...\n")
    insert_list = []

    # For each event, convert the event into a Python dictionary and
    # add it to a list
    for component in cal.walk():
        if component.name == "VEVENT": # If the thing is an event
            insert_list.append(make_dict(component)) # make_dict comes from ./calendar.py

    client.events.delete_many({}) # Clear the current database
    client.events.insert_many(insert_list) # Upload all of the events
    client.hash.update_one({"name": "latest"}, {"$set": {"hash": new_hash}}) # Update the hash

if __name__ == "__main__":
    check_for_changes()
