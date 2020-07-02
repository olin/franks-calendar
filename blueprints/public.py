from flask import Blueprint, render_template, request
from modules.db import db
from modules.email import send_confirmation
from bson.objectid import ObjectId
from icalendar import Calendar, Event
from datetime import datetime
import uuid


public = Blueprint('public', __name__, template_folder='../templates', static_folder='../static/build/')

@public.route('/', methods=['GET'])
def public_index():
    if request.method == "GET":
        return render_template('home.html')

@public.route('/add', methods=['POST', 'GET'])
def add_event():
    if request.method == 'GET':
        return render_template('add.html')
    elif request.method == 'POST':
        magicid = uuid.uuid4()
        eventid = ObjectId()
        event = {
            "_id": eventid,
            "title": request.form["title"],
            "description": request.form["description"],
            "location": request.form["location"],
            "start": request.form["start"],
            "end": request.form["end"],
            "rrule": request.form["rrule"],
            "last_edited": datetime.now(timezone.utc),
            "magic": magicid,
        }
        db.events.insert_one(event)

        link = request.base_url + "/edit/" + eventid + "?magic=" + magicid
        send_confirmation(request.form['email'], link)
        return redirect(url_for('confirmation/' + eventid))

@public.route('/about', methods=['GET'])
def about_page():
    if request.method == "GET":
        return render_template("about.html")

@public.route('/<page>', methods=['GET'])
def public_page(page):
    if request.method == "GET":
        try:
            rendered_page = render_template("%s.html" % page)
        except:
            rendered_page = render_template("404.html")
        return rendered_page

@public.route('/edit/<event_id>', methods=['PUT', 'GET', 'DELETE'])
def edit_event(event_id):
    
    magicid = request.args.get('magic')
    eventid = event_id
    event_data = db.events.find_one({'_id' : ObjectId(eventid)})
    if not event_data['magic'] == magicid or event_data is None:
        return render_template("404.html")
        #render a customized error page eventually?
    if request.method == 'GET':
        event_data = db.events.find_one({'_id' : ObjectId(eventid)})
        return render_template('edit-event.html', event_data=event_data)
    elif request.method == 'PUT':
        db.events.update(
            { _id: ObjectId(event_id)},
            #form is prepopulated with old values, so if user didn't change every a certain field, 
            #the database is updated with the old value (nothing changes)
            {
                "title": request.form["title"],
                "description": request.form["description"],
                "location": request.form["location"],
                "start": request.form["start"],
                "end": request.form["end"],
                "rrule": request.form["rrule"],
                "last_edited": datetime.now(timezone.utc),            
            }
        )
    elif request.method == 'DELETE':
        db.content.delete_one({'_id': ObjectId(eventid)})
        #notify users that an event has been deleted?
    else: 
        return render_template("404.html")
        #render a customized error page eventually?


@public.route('/admin', methods=['GET'])
def admin_page():
    if request.method == "GET":
        magicid = request.args.get('magic')
        adminid = request.args.get('adminid')
        admin = db.admins.find_one({'_id' : ObjectId(adminid)})
        if admin is None:
            return render_template('404.html')
        adminmagic = admin['magic']    
        if magicid == adminmagic:
            all_events = db.events.find()
            return render_template('admin.html', events = all_events)
        else:
            return render_template("404.html")
            #render a customized error page eventually?

@public.route('/confirmation', methods=['GET'])
def confirmation_page():
    if request.method == "GET":
        eventid = request.args.get('eventid')
        event_data = db.events.find_one({'_id' : ObjectId(eventid)})
        if event_data is None:
            return render_template('404.html')
            #render a customized error page eventually?
        else:
            return render_template('confirmation.html', event_data=event_data)


@public.route('/export/<eventid>', methods=['GET'])
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
