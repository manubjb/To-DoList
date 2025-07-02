import express from "express";
import { MongoClient } from "mongodb";
import { createClient } from "redis";

const app = express();
const port = 3000;

const mongoUrl  = process.env.MONGO_URL  || "mongodb://mongo:27017";
const redisHost = process.env.REDIS_HOST || "redis";

// conecta MongoDB e Redis assim que o container sobe
(async () => {
  const mongo = new MongoClient(mongoUrl);
  await mongo.connect();
  const db = mongo.db("testdb");

  const redis = createClient({ url: `redis://${redisHost}:6379` });
  await redis.connect();

  app.get("/api/hello", async (_req, res) => {
    // registra o hit no Mongo
    await db.collection("hits").insertOne({ date: new Date() });
    const count = await db.collection("hits").countDocuments();

    // guarda / lê algo simples no Redis
    const now = new Date().toISOString();
    await redis.set("last", now);
    const last = await redis.get("last");

    res.json({ message: "Tudo funcionando certinho!", mongoHits: count, redisLast: last });
  });

  app.listen(port, () => console.log(`Backend on port ${port}`));
})();

