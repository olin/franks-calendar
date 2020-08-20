import os
import base64
from icalendar import Calendar, Event
from datetime import datetime
from bson.objectid import ObjectId
from jinja2 import Template
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Email, 
    Attachment, 
    FileContent, 
    FileName, 
    FileType, 
    Disposition,
    Personalization
)

class EmailClient(object):
    @property
    def client(self):
        self._client = SendGridAPIClient(
            os.environ.get('API_KEY')
        ).client
        return self._client

    
    def send_email(self, subject, message, recipient, attachments=None, ismultiple=False):
            mail = Mail(
                from_email="frankscalendar.olin@gmail.com",
                html_content=message, 
                subject=subject,     
                )

            personalize = Personalization()
            
            if ismultiple:
                for email in recipient:
                    #add_bcc isn't working right now, and there doesn't seem to be a straightforward workaround
                    #will now work if any of the emails in recipient list is invalid
                    personalize.add_to(Email(email))
            else:
                personalize.add_to(Email(recipient))

            mail.add_personalization(personalize)

            if attachments:
                encoded_file = base64.b64encode(attachments).decode()
                attachedFile = Attachment(
                    FileContent(encoded_file),
                    FileName('event.ics'),
                    FileType('ical/ics'),
                    Disposition('attachment')
                )
                mail.attachment = attachedFile
            
            try:
                print("email sent bob")
                response = self.client.mail.send.post(request_body=mail.get())
            except Exception as e:
                print("email not sent")
                print("barreelasdasd")
                print(e.message)

    def send_ical(self, event_data, recipient):
        attachment = self.create_ical(event_data)
        path = os.getcwd() + "/templates/emails/export.txt"
        template = Template(open(path).read())
        content = template.render()

        self.send_email("Requested ical", content, recipient, attachment)

    def notify_shared_emails(self, event, recipients):
        #notifies everyone who exported this event that details have been changed
        attachment = self.create_ical(event)
        eventname = event['title']
        path = os.getcwd() + "/templates/emails/notify_shared_emails.txt"
        template = Template(open(path).read())
        content = template.render(name = eventname)
        self.send_email("An event you added to your calendar has changed", content, recipients, attachment, True)


    def send_edit_link(self, url, event, comments):
        #for whenever edits are required 
        eventlink = self.generate_edit_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/edit_event.txt"
        template = Template(open(path).read())
        content = template.render(name=eventname, reasons=comments, link=eventlink)

        self.send_email("Edits required for your event", content, recipient) 

    def send_submission_confirmation(self, url, event):
        #if user submits event via form, send confirmation of submission
        eventlink = self.generate_edit_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/await_approval.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email("Event submission awaiting approval", content, recipient ) 

    def send_reminder(self, url, event):
        #if user hasn't made requested edits, send reminder
        eventlink = self.generate_edit_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/cancelled.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email("Reminder to make requested edits!", content, recipient) 

    def send_approval_notice(self, url, event):
        #if event was approved by moderator, send notice
        eventlink = self.generate_edit_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/approved.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email("Event submission approved!", content, recipient) 

    def notify_moderator(self, code, event, moderator):
        #if event was modified after the moderator already approved it, an email will notify the moderator of changes
        editlink = "calendar.olin.build/admin?code=" + code
        path = os.getcwd() + "/templates/emails/notify_moderator.txt"
        recipient = moderator

        template = Template(open(path).read())

        content = template.render(
            link=editlink,
            title=event['title'], 
            location=event['location'], 
            dtstart=event['dtstart'], 
            dtend=event['dtend'], 
            description=event['description'], 
            host=event['host_name'], 
            host_email=event['host_email'])
        
        self.send_email("A published event was updated", content, moderator) 

    def generate_edit_link(self, base, event):
        magic = str(event['magic'])
        eventid = str(event['_id'])
        #issues with retrieving base right now, but should be resolved when we have permanent hosting solution
        #return base + "/edit?event_id=" + eventid + "&magic=" + magic   
        return "calendar.olin.build/edit/" + eventid + "?magic=" + magic 

    def create_ical(self, eventdata):
        #moved this method here from the public file bc we need to generate an ical multiple times
        cal = Calendar()
        event = Event()
        event["dtstart"] = datetime.strftime(eventdata["dtstart"], "%Y%m%dT%H%M%S")
        event["dtend"] = datetime.strftime(eventdata["dtend"], "%Y%m%dT%H%M%S")
        event["summary"] = eventdata["title"]
        event["location"] = eventdata["location"]
        event["description"] = eventdata["description"]
        cal.add_component(event)

        return cal.to_ical()
