import os
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
        self._client = SengGridAPIClient(
            os.environ.get('SENDGRID_API_LINK')
        )
        return self._client

    def send_email(recipient, subject, content):
        _mail = Mail(
            Email("frankscalendar.olin@gmail.com"),
            To(recipient),
            subject,
            content=Content("text/plain", content)
        )
        try:
            respose = sg.client.mail.send.post(request_body=mail.get())
        except:
            pass

# sg = SendGridAPIClient(os.environ.get('SENDGRID_API_LINK'))
#
# def send_email(recipient, subject, content):
#     _mail = Mail(
#         Email("frankscalendar.olin@gmail.com"),
#         To(recipient),
#         subject,
#         content=Content("text/plain", content),
#     )
#
#     try:
#         response = sg.client.mail.send.post(request_body=mail.get())
#     except Exception as e:
#         print(e.message)
#
# def generate_link():
#     #creates a link for user to be able to access/edit event. Maybe this function belongs in the db module
#     pass
