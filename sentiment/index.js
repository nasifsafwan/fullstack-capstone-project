import natural from "natural";

const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

export function analyzeSentiment(text = "") {
  const score = analyzer.getSentiment(tokenizer.tokenize(text));

  if (score > 0.25) {
    return { score, label: "positive" };
  }

  if (score < -0.25) {
    return { score, label: "negative" };
  }

  return { score, label: "neutral" };
}

