from flask import Flask
from pymongo import MongoClient
import yaml
from os.path import dirname, join
from urllib.request import urlopen
from icalendar import Calendar, Event
import os

file = open(join(dirname(__file__), "../private/config.yml"))

data = yaml.load(file.read(), Loader=yaml.SafeLoader)['db']

client = MongoClient(
        data['host'] + ':' + str(data['port']),
        username=data['user'],
        password=data['password'],
        authSource=data['dbName']
)

db = client[data['dbName']]

def check_for_changes():
    url = "https://calendar.google.com/calendar/ical/oc7b32uiqmg7f063or4n1tmdkk%40group.calendar.google.com/private-9c9790cd2613d41bc9c3d1a51831d430/basic.ics"
    ical = urlopen(url).read()
    cal = Calendar.from_ical(ical)
    print(hash(ical))

    n = db.hashes.find_one({'name': 'latest'})
    print(n['hash'])

    if (hash(ical) != n['hash']):
        db.hashes.find_one_and_update({'_id': n['_id']}, {
            "$set": {"hash": hash(ical)}
        })
        pid = fork()
        if pid == 0:
            update_database()
            os._exit()
        else:
            return 1
    else:
        return 0

if __name__ == "__main__":
    check_for_changes()
