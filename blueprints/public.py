from flask import Blueprint, render_template, request, redirect, url_for, current_app, abort, flash
from modules.db import DatabaseClient, Status
from modules.sg_client import EmailClient
from modules.forms import EventForm
from bson.objectid import ObjectId
import json
import uuid
from jinja2 import Template
import os
from .constants import categoryText

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
    return render_template("home.html")


@public.route("/add", methods=["POST", "GET"])
def add_event():
    form = EventForm()
    if request.method == "POST" and form.validate_on_submit():
        inserted_event = db.create_new_event(form.data)
        email.send_submission_confirmation(request.base_url, inserted_event)
        return redirect(
            url_for('public.confirmation',
                event_id=inserted_event['_id'],
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

@public.route("/guidelines", methods=["GET"])
def guidelines_page():
    return render_template("guidelines.html")


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

        if (str(event.get("magic")) != request.args.get("magic")) or (event is None):
            return render_template("404.html")

        return render_template("edit.html", form=form, magic=str(event.get("magic")), event_id=event_id)
    elif request.method == "POST":
        #I know this isn't good code, but it looks like db.update_event doesnt return the status and shared_email fields of event
        #So i need to make a second call to retrieve event. We can change this by making update_event return the status and shared_emails
        inserted_event = db.update_event(event_id, form.data)
        event_data = db.get_one(ObjectId(event_id))
        if event_data["status"] == Status.APPROVED.value:
            #if the event was already approved, send an email to everyone who may have exported and ical of the event
            emails = event_data.get("shared_emails")
            if emails:
                email.notify_shared_emails(event_data, emails)

        return redirect(
            url_for("public.edit_confirmation",
                event_id=inserted_event['_id'],
            ),
        )
    elif request.method == "DELETE":
        db.delete_event(event_id)
        # notify users that an event has been deleted?
    else:
        return render_template("404.html")
        # render a customized error page eventually?


@public.route("/admin", methods=["GET"])
def admin_page():
    if request.method == "GET":
        if request.args.get("code") != current_app.config.get("ADMIN_CODE"):
            abort(404)

        events = db.get_all_events_with_magic()
        return render_template("admin.html", events=events)


@public.route("/confirmation", methods=["GET"])
def confirmation():
    event_id = request.args.get('event_id')
    event = db.get_event_with_magic(event_id)

    start_date = event["dtstart"].strftime("%b %-d, %Y")
    start_time = event["dtstart"].strftime("%-H:%M %p")
    end_date = event["dtend"].strftime("%b %-d, %Y")
    end_time = event["dtend"].strftime("%-H:%M %p")

    if start_date == end_date:
        time_display = f"{start_date} {start_time} - {end_time}"
    else:
        time_display = f"{start_date} {start_time} - {end_date} {end_time}"

    return render_template("confirmation.html", event=event, time_display=time_display), 200


@public.route("/edit-confirmation")
def edit_confirmation():
    event_id = request.args.get('event_id')
    event = db.get_event_with_magic(event_id)

    start_date = event["dtstart"].strftime("%b %-d, %Y")
    start_time = event["dtstart"].strftime("%-H:%M %p")
    end_date = event["dtend"].strftime("%b %-d, %Y")
    end_time = event["dtend"].strftime("%-H:%M %p")

    if start_date == end_date:
        time_display = f"{start_date} {start_time} - {end_time}"
    else:
        time_display = f"{start_date} {start_time} - {end_date} {end_time}"

    return render_template("confirmation--published.html",
        event=event,
        time_display=time_display
    ), 200



@public.route("/export/<eventid>", methods=["POST"])
def export_event(eventid):
    event_data = db.get_one(ObjectId(eventid))
    recipient = json.loads(request.data).get("email")
    db.add_to_export_list(eventid, recipient)
    # add the recipient to a list of everyone who downloaded ical

    email.send_ical(event_data, recipient)
    return "Success", 200

@public.route("/approve/<event_id>", methods=["GET"])
def approve_event(event_id):
    magic = request.args.get("magic")
    event_data = db.get_event_with_magic(event_id)
    if (str(event_data["magic"]) != magic) or (not event_data):
        return redirect(url_for("public.index"))

    db.update_event(event_id, {
        "status": Status.APPROVED.value
    })
    email.send_approval_notice("",event_data)

    return redirect(url_for("public.admin_page", code="test"))


@public.route("/request_changes/<event_id>", methods=["GET"])
def request_event_changes(event_id):
    magic = request.args.get("magic")
    event_data = db.get_event_with_magic(event_id)
    if (str(event_data["magic"]) != magic) or (not event_data):
        return redirect(url_for("public.index"))

    db.update_event(event_id, {
        "status": Status.WAITING.value
    })

    path = os.getcwd() + "/templates/emails/edit_event.txt"
    template = Template(open(path).read())
    content = template.render(name=event_data["title"], link=email.generate_link("",event_data))

    return redirect("mailto://{}?subject=Your%20event%20requires%20edits&body={}".format(event_data.get("email"), content ), code=302)


@public.route("/cancel_event/<event_id>", methods=["GET"])
def cancel_event(event_id):
    magic = request.args.get("magic")
    event_data = db.get_event_with_magic(event_id)
    if (str(event_data["magic"]) != magic) or (not event_data):
        return redirect(url_for("public.index"))

    db.update_event(event_id, {
        "status": Status.CANCELED.value
    })
    path = os.getcwd() + "/templates/emails/cancelled.txt"
    template = Template(open(path).read())
    content = template.render(name=event_data["title"])

    if request.args.get("email"):
        return redirect("mailto://{}?subject=Your%20event%20was%20cancelled&body={}".format(event_data.get("email"), content ), code=302)
    else:
        flash("Your event has been canceled (refresh to clear this message)")
        return redirect(url_for("public.index"))
