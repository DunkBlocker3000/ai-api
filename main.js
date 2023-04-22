const openaiApiKey = process.env.OPENAI_API_KEY;

const form = document.querySelector("#form");
const urlInput = document.querySelector("#url-input");
const textInput = document.querySelector("#text-input");
const scenarios = document.querySelector("#scenarios");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const apiDocUrl = urlInput.value;
  const apiDocText = textInput.value;

  if (apiDocUrl) {
    fetch(apiDocUrl)
      .then((response) => response.text())
      .then((text) => generateScenarios(text));
  } else if (apiDocText) {
    generateScenarios(apiDocText);
  }
});

async function generateScenarios(apiDocText) {
  const openaiApi = new OpenAI({
    apiKey: openaiApiKey,
  });

  try {
    const completions = await openaiApi.complete({
      engine: "text-davinci-002",
      prompt: `Generate test scenarios for the following API documentation:\n${apiDocText}`,
      maxTokens: 2048,
      n: 1,
      stop: ["###"],
    });

    const generatedScenarios = completions.choices[0].text;
    scenarios.innerHTML = `<h2>Generated Scenarios</h2><p>${generatedScenarios}</p>`;
  } catch (error) {
    console.error(error);
    scenarios.innerHTML = "<p>Sorry, there was an error generating scenarios. Please try again.</p>";
  }
}
