from flask import Blueprint, render_template, request, send_file, make_response
from modules.db import db
from bson.objectid import ObjectId
import json
from icalendar import Calendar, Event

public = Blueprint('public', __name__, template_folder='../templates', static_folder='../static/build/')

@public.route('/')
def public_index():
    return render_template('home.html')

@public.route('/p/<page>')
def public_page(page):
    try:
        rendered_page = render_template("%s.html" % page)
    except:
        rendered_page = render_template("404.html")

    return rendered_page

@public.route('/export/<eventid>', methods=['POST', 'GET'])
def export_event(eventid):
    if request.method == 'GET':

        event_data = db.events.find_one({'_id' : ObjectId(eventid)})
        cal = Calendar()
        event = Event()
        event['dtstart'] = convert_time(str(event_data['start']))
        event['dtend'] = convert_time(str(event_data['end']))
        event['summary'] = event_data['title']
        event['location'] = event_data['location']
        event['description'] = event_data['description']
        cal.add_component(event)
        return cal.to_ical()

def convert_time(dt):
    #converts date time obejct into icalendar readable start and end time
    edited = ''.join(e for e in dt if e.isalnum())
    result = edited[:8] + "T" +  edited[8:]
    return result
