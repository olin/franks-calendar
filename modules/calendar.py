import icalendar
from bson.objectid import ObjectId
from datetime import datetime

# Turn an iCal event into a python dictionary to put into the database
def make_dict(event):
    ret = {
        "_id": ObjectId(),
        "title": str(event.get('summary')),
        "description": str(event.get('description')),
        "location": str(event.get('location')),
        "start": event.get('dtstart').dt,
        "end": event.get('dtend').dt,
    }
    return ret
