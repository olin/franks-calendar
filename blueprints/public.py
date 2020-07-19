from flask import Blueprint, render_template, request, redirect, url_for
from modules.db import DatabaseClient
from modules.sg_client import EmailClient
from modules.forms import EventForm
from bson.objectid import ObjectId
from icalendar import Calendar, Event
import json
from datetime import datetime
import uuid

db = DatabaseClient()
email = EmailClient()

public = Blueprint(
    "public",
    __name__,
    template_folder="../templates",
    static_folder="../static/build/"
)

@public.route("/", methods=["GET"])
def index():
    if request.method == "GET":
        return render_template("home.html")


@public.route("/add", methods=["POST", "GET"])
def add_event():
    form = EventForm()
    if request.method == "POST" and form.validate_on_submit():
        inserted_event = db.create_new_event(form.data)
        email.send_submission_confirmation(request.base_url, inserted_event)
        return redirect(
            url_for('public.confirmation',
                title=inserted_event['title'],
                category=inserted_event['category'],
                location=inserted_event['location'],
                start=inserted_event['dtstart'].strftime("%m/%d/%Y %-I:%M %p"),
                end=inserted_event['dtend'].strftime("%m/%d/%Y %-I:%M %p"),
                description=inserted_event['description'],
                host_name=inserted_event['host_name'],
                host_email=inserted_event['host_email'],
                event_id=inserted_event['_id'],
                duration=inserted_event['duration']
            )
        )
    return render_template("add.html", form=form)

@public.route("/about", methods=["GET"])
def about_page():
    if request.method == "GET":
        return render_template("about.html")


@public.route("/faq", methods=["GET"])
def faq_page():
    return render_template("faq.html")


@public.route("/edit/<event_id>", methods=["POST", "GET", "DELETE"])
def edit_event(event_id):
    event = db.get_event_with_magic(event_id)
    form = EventForm()

    if request.method == "GET":
        # Should've used SQLAlchemy and Postgres
        form.title.data = event.get("title")
        form.location.data = event.get("location")
        form.dtstart.data = event.get("dtstart")
        form.dtend.data = event.get("dtend")
        form.category.data = event.get("category")
        form.description.data = event.get("description")
        form.host_name.data = event.get("host_name")
        form.host_email.data = event.get("host_email")
        form.duration.data = event.get("duration")

        if (str(event.get("magic")) != request.args.get("magic")) or (event is None):
            return render_template("404.html")

        return render_template("edit.html", form=form)
    elif request.method == "POST":
        db.update_event(event_id, form.data)

        return redirect(url_for("public.index"))
    elif request.method == "DELETE":
        db.delete_event(event_id)
        # notify users that an event has been deleted?
    else:
        return render_template("404.html")
        # render a customized error page eventually?


@public.route("/admin", methods=["GET"])
def admin_page():
    if request.method == "GET":
        events = db.get_all_events_with_magic()
        return render_template("admin.html", events=events)


@public.route("/confirmation", methods=["GET"])
def confirmation():
    event_id = request.args.get('event_id')
    magic_id = db.get_event_with_magic(event_id)["magic"]

    duration_type = request.args.get('duration')
    if duration_type == "hour":
        duration = request.args.get('start') + " - " + "".join(request.args.get('end').split(' ')[1:])
    elif duration_type == "day":
        duration = request.args.get('start').split(' ')[0]
    elif duration_type == "many":
        duration = request.args.get('start').split(' ')[0] + " - " + request.args.get('end').split(' ')[0]
    else:
        duration = request.args.get('start') + " - " + request.args.get('end')

    return render_template("confirmation.html",
        title=request.args.get('title'),
        category=request.args.get('category'),
        location=request.args.get('location'),
        description=request.args.get('description'),
        host_name=request.args.get('host_name'),
        host_email=request.args.get('host_email'),
        magic_link=f"/edit/{event_id}?magic={magic_id}",
        duration=duration,
    ), 200


@public.route("/export/<eventid>", methods=["GET"])
def export_event(eventid):
    if request.method == "GET":
        event_data = db.get_one(ObjectId(eventid))
        cal = Calendar()
        event = Event()
        event["dtstart"] = datetime.strftime(event_data["dtstart"], "%Y%m%dT%H%M%S")
        event["dtend"] = datetime.strftime(event_data["dtend"], "%Y%m%dT%H%M%S")
        event["summary"] = event_data["title"]
        event["location"] = event_data["location"]
        event["description"] = event_data["description"]
        cal.add_component(event)
        return cal.to_ical()


@public.route("/approve/<event_id>", methods=["GET"])
def update_status(event_id):
    new_status = request.args.get("status")
    if not new_status:
        return redirect(url_for("public.index"))

    event_data = db.get_event_with_magic(event_id)
    if not event_data:
        return redirect(url_for("public.index"))


@public.route("/test-edit", methods=["GET"])
def test_edit_page():
    form = EventForm()
    return render_template("edit.html", form=form)

@public.route("/test-confirmation", methods=["GET"])
def test_confirmation_page():
    return render_template("confirmation.html")

@public.route("/test-admin", methods=["GET"])
def test_admin_page():
    if request.method == "GET":
        return render_template("admin.html", events=[])
