from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://jackg:eminem answered primarily charity@192.168.86.75:3306/franks_calendar"
db = SQLAlchemy(app)

def wrap_db(app):
    db.init_app(app)

class Calendar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    url = db.Column(db.String(500))

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    date = db.Column(db.DateTime)
    tags = db.Column(db.String(255))

