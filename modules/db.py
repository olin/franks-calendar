from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util
from uuid import uuid4 as uuid
from datetime import datetime, timezone

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

    def get_event_with_magic(self, event_id):
        return self.client.events.find_one({
            "_id": ObjectId(event_id)
        })

    def create_new_event(self, event):
        event["magic"] = self.generate_magic_string()
        event["last_edited"] = datetime.now(timezone.utc)
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
        _magic = event["magic"]
        if _magic == magic:
            return True
        else:
            return False

    def delete(self, event_id):
        self.client.delete_one({
            "_id": event_id
        })

    @staticmethod
    def generate_magic_string():
        return uuid()

if __name__ == "__main__":
    db = DatabaseClient()
