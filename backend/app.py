from flask import Flask, request, jsonify
from pymongo import MongoClient
import redis
import os

app = Flask(__name__)

# MongoDB
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(mongo_url)
db = client["appdb"]
tasks = db["tasks"]

# Redis
redis_host = os.getenv("REDIS_HOST", "localhost")
r = redis.Redis(host=redis_host, port=6379, decode_responses=True)

@app.route("/visits")
def visits():
    count = r.incr("visits")
    return jsonify(visits=count)

@app.route("/tasks")
def get_tasks():
    result = list(tasks.find({}, {"_id": 0}))
    return jsonify(tasks=result)

@app.route("/tasks", methods=["POST"])
def add_task():
    title = request.args.get("title")
    if title:
        tasks.insert_one({"title": title})
        return jsonify(message="Tarefa adicionada")
    return jsonify(error="Título não enviado"), 400
