import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import giftsSeed from "../../data/gifts.json" with { type: "json" };

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "giftdb";

let client;
let database;
let memoryDatabase;

function normalizeValue(value) {
  if (value instanceof ObjectId) {
    return value.toString();
  }

  return value;
}

function matchesFilter(document, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$text") {
      const needle = String(expected.$search || "").toLowerCase();
      const haystack = [document.title, document.description, document.category, ...(document.tags || [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    }

    if (expected && typeof expected === "object" && "$regex" in expected) {
      return new RegExp(expected.$regex, expected.$options || "").test(String(document[key] || ""));
    }

    return normalizeValue(document[key]) === normalizeValue(expected);
  });
}

function createMemoryCollection(records) {
  return {
    async createIndex() {
      return undefined;
    },
    find(filter = {}) {
      let result = records.filter((record) => matchesFilter(record, filter));

      return {
        sort(sortSpec = {}) {
          const [[field, direction]] = Object.entries(sortSpec);
          result = [...result].sort((left, right) => {
            const leftValue = new Date(left[field]).getTime() || left[field];
            const rightValue = new Date(right[field]).getTime() || right[field];
            return direction >= 0 ? leftValue - rightValue : rightValue - leftValue;
          });

          return {
            async toArray() {
              return result.map((item) => ({ ...item }));
            }
          };
        },
        async toArray() {
          return result.map((item) => ({ ...item }));
        }
      };
    },
    async findOne(filter = {}) {
      const match = records.find((record) => matchesFilter(record, filter));
      return match ? { ...match } : null;
    },
    async insertOne(document) {
      const nextDocument = {
        ...document,
        _id: document._id || new ObjectId()
      };
      records.push(nextDocument);
      return { insertedId: nextDocument._id };
    },
    async updateOne(filter = {}, update = {}) {
      const index = records.findIndex((record) => matchesFilter(record, filter));

      if (index === -1) {
        return { matchedCount: 0, modifiedCount: 0 };
      }

      const nextValues = update.$set || {};
      records[index] = {
        ...records[index],
        ...nextValues
      };

      return { matchedCount: 1, modifiedCount: 1 };
    }
  };
}

function createMemoryDatabase() {
  if (memoryDatabase) {
    return memoryDatabase;
  }

  const gifts = giftsSeed.map((gift) => ({
    ...gift,
    _id: new ObjectId(),
    createdAt: new Date(gift.createdAt.$date)
  }));
  const users = [];

  memoryDatabase = {
    collection(name) {
      if (name === "gifts") {
        return createMemoryCollection(gifts);
      }

      if (name === "users") {
        return createMemoryCollection(users);
      }

      throw new Error(`Unknown in-memory collection: ${name}`);
    }
  };

  return memoryDatabase;
}

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  if (process.env.USE_IN_MEMORY_DB === "true") {
    database = createMemoryDatabase();
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
  }

  database = undefined;
  memoryDatabase = undefined;
}

export default connectToDatabase;
