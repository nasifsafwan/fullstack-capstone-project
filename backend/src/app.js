import express from "express";
import cors from "cors";
import giftRoutes from "./routes/giftRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sentimentRoutes from "./routes/sentimentRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", giftRoutes);
app.use("/api", searchRoutes);
app.use("/api", authRoutes);
app.use("/api", sentimentRoutes);

app.use((error, _request, response, _next) => {
  response.status(500).json({ message: "Unexpected server error.", error: error.message });
});

export default app;

