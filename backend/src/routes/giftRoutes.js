import express from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../db.js";

const giftRoutes = express.Router();

giftRoutes.get("/gifts", async (_request, response) => {
  try {
    const db = await connectToDatabase();
    const gifts = await db.collection("gifts").find({}).sort({ createdAt: -1 }).toArray();
    response.json(gifts);
  } catch (error) {
    response.status(500).json({ message: "Unable to load gift listings.", error: error.message });
  }
});

giftRoutes.get("/gifts/:id", async (request, response) => {
  try {
    const db = await connectToDatabase();
    const gift = await db.collection("gifts").findOne({ _id: new ObjectId(request.params.id) });

    if (!gift) {
      return response.status(404).json({ message: "Gift not found." });
    }

    return response.json(gift);
  } catch (error) {
    return response.status(400).json({ message: "Invalid gift identifier.", error: error.message });
  }
});

export default giftRoutes;

