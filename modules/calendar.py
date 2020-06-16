import icalendar
from bson.objectid import ObjectId
import datetime

# Turn an iCal event into a python dictionary to put into the database
def make_dict(event):
    ret = {
        "_id": ObjectId(),
        "title": str(event.get('summary')),
        "description": str(event.get('description')),
        "location": str(event.get('location')),
    }

    if isinstance(event.get('dtstart').dt, datetime.datetime):
        ret['start'] = event.get('dtstart').dt
        ret['end'] = event.get('dtend').dt
    else:
        ret['start'] = datetime.datetime.combine(event.get('dtstart').dt, datetime.datetime.min.time())
        ret['end'] = datetime.datetime.combine(event.get('dtend').dt, datetime.datetime.min.time())


    if event.get('rrule') != None:
        ret['rrule'] = event.get('rrule').to_ical().decode()

    return ret

email_map = {
    'registrar@olin.edu': 'academic-calendar',
    'angela.burke@olin.edu': 'academic-calendar',
    'vivien.bouffard@olin.edu': 'academic-calendar',
    'linda.canavan@olin.edu': 'academic-calendar',
    'mark.somerville@olin.edu': 'academic-calendar',
    'adva.waranyuwat@olin.edu': 'academic-advising',
    'cbeach@olin.edu': 'international',
    'shodge@olin.edu': 'residential',
    'bgrampetro@olin.edu': 'health',
    'suzanne.alcott@olin.edu': 'pgp',
    'sally.phelps@olin.edu': 'pgp',
    'hr@olin.edu': 'hr',
    'alia.georges@olin.edu': 'admissions',
    'vmoore@olin.edu': 'admissions',
    'krystal.burgos@olin.edu': 'admissions',
    'susan.brisson@olin.edu': 'admissions',
    'jean.ricker@olin.edu': 'admissions',
    'susan.goldstein@olin.edu': 'admissions',
    'emily.roper-doten@olin.edu': 'admissions',
    'FinAid@olin.edu': 'admissions',
    'library@olin.edu': 'library',
    'cbignoli@olin.edu': 'library',
    'manderson@olin.edu': 'library',
    'mmullen@olin.edu': 'library',
    'daniela.faas@olin.edu': 'shop',
    'nathan.cantrell@olin.edu': 'shop',
    'lewing@olin.edu': 'shop',
    'bruce.andruskiewicz@olin.edu': 'shop',
}
