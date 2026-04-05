import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "giftlink";

let client;
let database;

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(uri);
  await client.connect();
  database = client.db(dbName);

  await Promise.all([
    database.collection("gifts").createIndex({ title: "text", description: "text", category: "text" }),
    database.collection("gifts").createIndex({ category: 1, condition: 1, location: 1 }),
    database.collection("users").createIndex({ email: 1 }, { unique: true })
  ]);

  return database;
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = undefined;
    database = undefined;
  }
}

