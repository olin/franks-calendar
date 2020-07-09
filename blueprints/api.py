from flask import jsonify, request, jsonify
import json
from flask.views import MethodView
from datetime import datetime
from bson import json_util
# from bson.objectid import ObjectId
from modules.db import DatabaseClient
from datetime import datetime, timezone

db = DatabaseClient()

class API(MethodView):
    def get(self, id):
        if id:
            return db.get_one(id)
        else:
            query = db.get_all_events()
            
            return jsonify(json_util.dumps(query)), 200

    # def post(self):
    #     # request_data = json.loads(request.get_data(as_text=True))
    #     #
    #     # event = {
    #     #     "_id": ObjectId(),
    #     #     "title": request_data.get("title"),
    #     #     "description": request_data.get("description"),
    #     #     "location": request_data.get("location"),
    #     #     "start": request_data.get("start"),
    #     #     "end": request_data.get("end"),
    #     #     "rrule": request_data.get("rrule"),
    #     #     "last_edited": datetime.now(timezon.utc),
    #     # }
    #     # db.events.insert_one(event)
    #     # return jsonify(json.loads(json_util.dumps(event))), 201
    #     pass

    # def put(self, id):
    #     request_data = json.loads(request.get_data(as_text=True))
    #
    #     db.posts.find_one_and_update({'_id': ObjectId(id)}, {
    #         "$set": request_data,
    #     }, return_document=ReturnDocument.AFTER)
    #     return jsonify(return_document)
    #
    # def delete(self, id):
    #     db.content.delete_one({'_id': ObjectId(id)})
    #     return jsonify("ObjectId(" + content_id + ") deleted."), 200
