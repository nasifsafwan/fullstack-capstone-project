import express from "express";
import { connectToDatabase } from "../db.js";

const searchRoutes = express.Router();

searchRoutes.get("/search", async (request, response) => {
  try {
    const db = await connectToDatabase();
    const { q, category, condition, location, tag } = request.query;
    const filters = {};

    if (q) {
      filters.$text = { $search: q };
    }

    if (category) {
      filters.category = category;
    }

    if (condition) {
      filters.condition = condition;
    }

    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    if (tag) {
      filters.tags = tag;
    }

    const cursor = db.collection("gifts").find(filters);
    const results = await cursor.sort({ createdAt: -1 }).toArray();

    response.json({
      total: results.length,
      filters: { q, category, condition, location, tag },
      results
    });
  } catch (error) {
    response.status(500).json({ message: "Unable to search listings.", error: error.message });
  }
});

export default searchRoutes;

