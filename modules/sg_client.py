import os
from jinja2 import Template
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Email,
    To,
    Content
)

class EmailClient(object):
    @property
    def client(self):
        self._client = SendGridAPIClient(
            os.environ.get('API_KEY')
        ).client
        return self._client

    def send_email(self, recipient, subject, message):
        mail = Mail(
            Email("frankscalendar.olin@gmail.com"),
            To(recipient),
            subject,
            Content("text/plain", message)
        )
        try:
            response = self.client.mail.send.post(request_body=mail.get())
        except Exception as e:
            print(e.message)


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

    def send_cancellation_notice(self, event, comments):
        #if event was cancelled by moderator, send notice
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/cancelled.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, reasons=comments)

        self.send_email(recipient, "Event submission was cancelled", content) 

    def send_approval_notice(self, event):
        #if event was approved by moderator, send notice
        eventlink = self.generate_link(url, event)
        eventname = event['title']
        recipient = event['host_email']
        path = os.getcwd() + "/templates/emails/approved.txt"

        template = Template(open(path).read())
        content = template.render(name=eventname, link=eventlink)

        self.send_email(recipient, "Event submission approved!", content) 

    def generate_link(self, base, event):
        #magic = event['magic']
        magic = "fakemagiclink"
        eventid = str(event['_id'])
        #issues with retrieving base right now, but should be resolved when we have permanent hosting solution
        #return base + "/edit?event_id=" + eventid + "&magic=" + magic   
        return "frankscalendar/edit?event_id=" + eventid + "&magic=" + magic    
