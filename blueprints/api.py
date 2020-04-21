from flask import jsonify, request
import json
from flask.views import MethodView
from datetime import datetime

class API(MethodView):
    def get(self, id):
        if id is None:
            ret = []
            query = db.events.find()
            for doc in query:
                ret.append(json.loads(json_util.dumps(doc)))
        return ret

    def post(self, id):
        return None

    def put(self, id):
        return None

    def delete(self, id):
        return None
