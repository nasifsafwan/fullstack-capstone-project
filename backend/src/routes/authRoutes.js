import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const authRoutes = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const TOKEN_EXPIRES_IN = "7d";

function buildToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function mapUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    city: user.city || "",
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || ""
  };
}

authRoutes.post("/auth/register", async (request, response) => {
  try {
    const db = await connectToDatabase();
    const { name, email, password, city = "", bio = "" } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return response.status(409).json({ message: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      city,
      bio,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("users").insertOne(user);
    const savedUser = { ...user, _id: result.insertedId };
    const token = buildToken(savedUser);

    return response.status(201).json({ token, user: mapUser(savedUser) });
  } catch (error) {
    return response.status(500).json({ message: "Unable to register user.", error: error.message });
  }
});

authRoutes.post("/auth/login", async (request, response) => {
  try {
    const db = await connectToDatabase();
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required." });
    }

    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    const token = buildToken(user);
    return response.json({ token, user: mapUser(user) });
  } catch (error) {
    return response.status(500).json({ message: "Unable to log in.", error: error.message });
  }
});

authRoutes.get("/auth/profile", requireAuth, async (request, response) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(request.user.sub) });

    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    return response.json({ user: mapUser(user) });
  } catch (error) {
    return response.status(500).json({ message: "Unable to load profile.", error: error.message });
  }
});

authRoutes.put("/auth/profile", requireAuth, async (request, response) => {
  try {
    const db = await connectToDatabase();
    const { name, city, bio, avatarUrl } = request.body;
    const updates = {
      updatedAt: new Date()
    };

    if (typeof name === "string") updates.name = name;
    if (typeof city === "string") updates.city = city;
    if (typeof bio === "string") updates.bio = bio;
    if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl;

    await db.collection("users").updateOne(
      { _id: new ObjectId(request.user.sub) },
      { $set: updates }
    );

    const user = await db.collection("users").findOne({ _id: new ObjectId(request.user.sub) });
    return response.json({ token: buildToken(user), user: mapUser(user) });
  } catch (error) {
    return response.status(500).json({ message: "Unable to update profile.", error: error.message });
  }
});

export default authRoutes;

