import os
import base64
from bson.objectid import ObjectId
from jinja2 import Template
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Email,
    To,
    Content, 
    Attachment, 
    FileContent, 
    FileName, 
    FileType, 
    Disposition
)

class EmailClient(object):
    @property
    def client(self):
        self._client = SendGridAPIClient(
            os.environ.get('API_KEY')
        ).client
        return self._client

    
    def send_email(self, recipient, subject, message, attachments=None):
            mail = Mail(
                Email("frankscalendar.olin@gmail.com"),
                To(recipient),
                subject,
                Content("text/html", message), 
            )
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
                response = self.client.mail.send.post(request_body=mail.get())
            except Exception as e:
                print(e)

    def send_ical(self, attachment, recipient):
            path = os.getcwd() + "/templates/emails/export.txt"
            template = Template(open(path).read())
            content = template.render()

            self.send_email(recipient, "Requested ical", content, attachment)


    def send_edit_link(self, url, event, comments):
        #for whenever edits are required 
        eventlink = self.generate_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/edit_event.txt"
        template = Template(open(path).read())
        content = template.render(name=eventname, reasons=comments, link=eventlink)

        self.send_email(recipient, "Edits required for your event", content) 

    def send_submission_confirmation(self, url, event):
        #if user submits event via form, send confirmation of submission
        eventlink = self.generate_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/await_approval.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email(recipient, "Event submission awaiting approval", content) 

    def send_reminder(self, url, event):
        #if user hasn't made requested edits, send reminder
        eventlink = self.generate_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/cancelled.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email(recipient, "Reminder to make requested edits!", content) 

    def send_approval_notice(self, url, event):
        #if event was approved by moderator, send notice
        eventlink = self.generate_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/approved.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email(recipient, "Event submission approved!", content) 

    def notify_moderator(self, url, event, moderator):
        #if event was modified after the moderator already approved it, an email will notify the moderator of changes
        editlink = url + "/admin"
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
        
        self.send_email(recipient, "A published event was updated", content) 

    def generate_link(self, base, event):
        magic = str(event['magic'])
        eventid = str(event['_id'])
        #issues with retrieving base right now, but should be resolved when we have permanent hosting solution
        #return base + "/edit?event_id=" + eventid + "&magic=" + magic   
        return "64.227.7.192:5000/edit/" + eventid + "?magic=" + magic    
