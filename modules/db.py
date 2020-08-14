from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util
from uuid import uuid4 as uuid
from datetime import datetime, timezone
from enum import Enum


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
        self._client = MongoClient(
            "database:27017",
            username="frank",
            password="calendar",
            authSource="calendar-dev"
        )['calendar-dev']

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

    def create_new_event(self, event):
        event["magic"] = self.generate_magic_string()
        event["last_edited"] = datetime.now(timezone.utc)
        event["status"] = Status.PENDING.value
        del event['csrf_token']
        inserted_id = self.client.events.insert_one(event).inserted_id
        event["_id"] = inserted_id
        return event

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

    def update_event(self, event_id, form):
        ret = self.client.events.update_one(
            {
                "_id": ObjectId(event_id)
            },
            {
                "$set": form
            }
        )
        form["_id"] = event_id
        return form

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
