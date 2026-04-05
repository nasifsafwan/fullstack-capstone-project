import express from "express";
import natural from "natural";

const sentimentRoutes = express.Router();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

sentimentRoutes.post("/sentiment", (request, response) => {
  const { text = "" } = request.body;

  if (!text.trim()) {
    return response.status(400).json({ message: "Text is required for sentiment analysis." });
  }

  const score = analyzer.getSentiment(tokenizer.tokenize(text));
  let label = "neutral";

  if (score > 0.25) {
    label = "positive";
  } else if (score < -0.25) {
    label = "negative";
  }

  return response.json({ score, label });
});

export default sentimentRoutes;

