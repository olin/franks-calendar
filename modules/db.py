from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util
from uuid import uuid4 as uuid
from datetime import datetime, timezone
from enum import Enum
import os
import time


class Status(Enum):
    WAITING = "Awaiting Info"
    PENDING = "Pending Approval"
    APPROVED = "Approved"
    CANCELED = "Canceled"


class DatabaseClient(object):
    """
    Database Client
    """
    @property
    def client(self):
        # Get the MongoDB SRV connection string and the database name from environment variables
        srv = os.environ.get('MONGODB_SRV')
        db_name = os.environ.get('MONGODB_DB_NAME')
        if not srv:
            raise EnvironmentError('Could not find the environment variable "MONGODB_SRV"')
        if not db_name:
            raise EnvironmentError('Could not find the environment variable "MONGODB_DB_NAME"')
        self._client = MongoClient(srv)[db_name]

        return self._client

    def get_one(self, event_id):
        return self.client.events.find_one({
            "_id": ObjectId(event_id)
        }, {
            "magic": False
        })

    def get_all_events(self):
        return [doc for doc in self.client.events.find({}, {'magic': False})]

    def get_approved_events(self):
        return [doc for doc in self.client.events.find({}, {"magic": False}) if doc.get("status") == Status.APPROVED.value]

    def get_all_events_with_magic(self):
        return [doc for doc in self.client.events.find()]

    def get_event_with_magic(self, event_id):
        try:
            object_id = ObjectId(event_id)

            return self.client.events.find_one({
                "_id": object_id
            })
        except:
            return {}

    def _parse_iso_date_str(self, date_time_str):
        # datetime.fromisoformat does not handle using "Z" to represent the UTC timezone
        # (see https://bugs.python.org/issue35829), which is how JavaScript encodes that
        # timezone, so we need to convert the format to one readable by Python first
        if date_time_str.endswith('Z'):
            # Drop the 'Z' and append the UTC timezone offset
            date_time_str = date_time_str[:-1] + '+00:00'
        return datetime.fromisoformat(date_time_str)

    def _properly_set_event_dates(self, event):
        is_all_day = event.get('all_day', False)
        # Convert the datetime strings to either date (for all-day events) or datetime (for events with times) objects
        if is_all_day:
            # The values sent from the web client are date strings.
            # We want to store them as datetime objects in the database so that we can do queries
            # for events between certain date ranges, so we need to convert it to a datetime object first.
            # Let's just assume that an all-day event starts at midnight Eastern time and ends the following midnight
            # (though we should remove this assumption by stripping the time when generating iCals later).
            utc_offset_hours = -time.altzone / 3600
            event['dtstart'] = datetime.fromisoformat(f"{event['dtstart']} 00:00.000{utc_offset_hours:03.0f}:00")
            event['dtend'] = datetime.fromisoformat(f"{event['dtend']} 23:59.999{utc_offset_hours:03.0f}:00")
        else:
            # The values sent from the web client are datetime strings.
            # Given that users were told to set the time based on their current timezone and that their
            # browser should have encoded timezone information in the strings, the date and time
            # _should_ be correct as-is.
            event['dtstart'] = self._parse_iso_date_str(event['dtstart'])
            event['dtend'] = self._parse_iso_date_str(event['dtend'])

    def create_new_event(self, event):
        event["magic"] = self.generate_magic_string()
        event["last_edited"] = datetime.now(timezone.utc)
        event["status"] = Status.PENDING.value
        self._properly_set_event_dates(event)
        del event['csrf_token']
        inserted_id = self.client.events.insert_one(event).inserted_id
        event["_id"] = inserted_id
        return event

    def clear_mod_message(self):
        self.client.mod_messages.delete_many({})
    
    def set_mod_message(self, message):
        self.clear_mod_message()
        self.client.mod_messages.insert_one({"message": message})

    def get_mod_message(self):
        mod_dict = self.client.mod_messages.find_one({})
        if mod_dict is not None:
            mod_message = mod_dict["message"]
            return mod_message
        else: 
            return ""
        

    def authenticate_magic_link(self, event_id, magic):
        event = self.client.events.find_one({
            "_id": ObjectId(event_id),
        }, {
            "magic": True
        })
        if event["magic"] == magic:
            return True
        else:
            return False

    def update_event(self, event_id, event):
        if 'dtstart' in event and 'dtend' in event:
            self._properly_set_event_dates(event)
        ret = self.client.events.update_one(
            {
                "_id": ObjectId(event_id)
            },
            {
                "$set": event
            }
        )
        return event

    def add_to_export_list(self, event_id, email):
        self.client.events.update_one(
            {
                "_id":ObjectId(event_id)
            },
            {
                "$addToSet": {"shared_emails" : email}
            }
        )

    def delete(self, event_id):
        self.client.delete_one({
            "_id": event_id
        })

    @staticmethod
    def generate_magic_string():
        return uuid()

if __name__ == "__main__":
    db = DatabaseClient()
