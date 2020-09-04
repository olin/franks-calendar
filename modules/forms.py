from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    DateTimeField,
    BooleanField,
    SelectField,
    TextAreaField,
    FormField
)
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired


class EventForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    location = StringField('Location', validators=[DataRequired()])
    dtstart = StringField('Start', validators=[DataRequired()])
    dtend = StringField('End', validators=[DataRequired()])
    all_day = BooleanField('All Day')
    category = SelectField('Category', validators=[DataRequired()], choices=[
        ("", "-- select an option --"),
        ("academic_affairs:academic_calendar", "Academic Calendar"),
        ("academic_affairs:academic_support", "Academic Support"),
        ("student_affairs:residential", "Residential"),
        ("student_affairs:health", "Health and Wellness"),
        ("student_affairs:pgp", "PGP"),
        ("student_affairs:hr", "HR"),
        ("student_affairs:diversity", "Diversity and Inclusion"),
        ("student_affairs:international", "Intl' and Study Away"),
        ("admission", "Admission and Financial Aid"),
        ("library", "The Library"),
        ("shop", "The Shop"),
        ("clubs", "Clubs and Organizations"),
        ("other", "Other Events"),
    ])
    description = TextAreaField('Description', validators=[DataRequired()])
    host_name = StringField('Host Name', validators=[DataRequired()])
    host_email = EmailField('Host Email', validators=[DataRequired()])

class ModMessageForm(FlaskForm):
    modMessage = TextAreaField('modMessage')