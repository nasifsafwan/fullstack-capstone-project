import dotenv from "dotenv";
import natural from "natural";
import app from "./app.js";
import { connectToDatabase } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    app.locals.nlp = natural;

    app.listen(PORT, () => {
      console.log(`GiftLink API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start GiftLink API", error);
    process.exit(1);
  }
}

startServer();
