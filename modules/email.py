import os
from sendgrid import SendGridAPIClient
import sendgrid
from sendgrid.helpers.mail import *


def send_confirmation(toemail, link):
    sg = sendgrid.SendGridAPIClient(os.environ.get('SENDGRID_API_LINK'))
    from_email = Email("frankscalendar.olin@gmail.com")
    to_email = To(toemail)
    subject = "New event added to frankscalendar"
    content = Content("text/plain", "New event added to frankscalendar. To edit, click here: "+link)
    mail = Mail(from_email, to_email, subject, content)
    
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def generate_link():
    #creates a link for user to be able to access/edit event. Maybe this function belongs in the db module
    pass

if __name__ == "__main__":
    pass
