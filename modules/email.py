import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_confirmation(toemail, link):
    message = Mail(
    from_email='frankscalendar@gmail.com',
    to_emails=toemail, #email of person who created event
    subject='New event added to Franks calendar!',
    html_content='<strong>and easy to do anywhere, even with Python</strong>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def generate_link():
    #creates a link for user to be able to access/edit event. Maybe this function belongs in the db module
    pass

