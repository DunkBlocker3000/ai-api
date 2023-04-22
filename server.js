const express = require("express");
const openai = require("openai");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const generateScenarios = async (text) => {
  const prompt = "Provide a comprehensive list of scenarios to test the software described in this text.";
  const engine = "text-davinci-002";
  const maxTokens = 100;
  const temperature = 0.5;
  const n = 5;

  const completions = await openai.complete({
    engine,
    prompt,
    maxTokens,
    temperature,
    n,
    apiKey,
    promptSuffix: text,
  });

  if (completions.choices.length === 0)
