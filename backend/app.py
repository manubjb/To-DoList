from flask import Flask, request, jsonify
from pymongo import MongoClient
import redis
import os

app = Flask(__name__)

mongo = MongoClient(os.getenv("MONGO_URL", "mongodb://mongo:27017"))
db = mongo["appdb"]
tasks = db["tasks"]

r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)

@app.route("/visits")
def visits():
    count = r.incr("visits")
    return jsonify(visits=count)

@app.route("/tasks")
def list_tasks():
    result = list(tasks.find({}, {"_id": 0}))
    return jsonify(tasks=result)

@app.route("/tasks", methods=["POST"])
def add_task():
    title = request.args.get("title")
    if title:
        tasks.insert_one({"title": title})
        return jsonify(message="Tarefa adicionada")
    return jsonify(error="Título ausente"), 400
