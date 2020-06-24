from flask import Blueprint, render_template, request, send_file, make_response
from modules.db import db
from modules.email import send_confirmation
from bson.objectid import ObjectId
from icalendar import Calendar, Event
from datetime import datetime

public = Blueprint('public', __name__, template_folder='../templates', static_folder='../static/build/')

@public.route('/')
def public_index():
    return render_template('home.html')

@public.route('/add', methods=['POST', 'GET'])
def add_event():
    if request.method == 'GET':
        return render_template('add.html')

@public.route('/about', methods=['GET'])
def about_page():
    return render_template("about.html")

@public.route('/<page>')
def public_page(page):
    try:
        rendered_page = render_template("%s.html" % page)
    except:
        rendered_page = render_template("404.html")

    return rendered_page

@public.route('/new', methods=['POST', 'GET'])
def new_import():
    if request.method == 'POST':  
        link = generate_link()  
        send_confirmation(request.form['email'], link)


@public.route('/export/<eventid>', methods=['POST', 'GET'])
def export_event(eventid):
    if request.method == 'GET':

        event_data = db.events.find_one({'_id' : ObjectId(eventid)})
        cal = Calendar()
        event = Event()
        event['dtstart'] = datetime.strftime(event_data['start'], '%Y%m%dT%H%M%S')
        event['dtend'] = datetime.strftime(event_data['end'], '%Y%m%dT%H%M%S')
        event['summary'] = event_data['title']
        event['location'] = event_data['location']
        event['description'] = event_data['description']
        cal.add_component(event)
        return cal.to_ical()
