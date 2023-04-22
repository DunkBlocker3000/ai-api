const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function analyzeDocumentation(prompt) {
  const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 500,
      n: 1,
      stop: ["###"]
    })
  });

  const data = await response.json();
  const completion = data.choices[0].text.trim();

  return completion;
}

function generateScenarioList(completion) {
  const regex = /(?<=\n- ).*/g;
  const matches = completion.match(regex);
  return matches;
}

async function generateScenarios() {
  const prompt = document.getElementById("prompt").value.trim();
  const generateButton = document.getElementById("generateButton");
  generateButton.disabled = true;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const loadingIndicator = document.createElement("p");
  loadingIndicator.innerText = "Loading...";
  resultsDiv.appendChild(loadingIndicator);

  try {
    const completion = await analyzeDocumentation(prompt);
    const scenarios = generateScenarioList(completion);

    if (scenarios.length > 0) {
      const scenariosList = document.createElement("ul");
      for (const scenario of scenarios) {
        const scenarioItem = document.createElement("li");
        scenarioItem.innerText = scenario;
        scenariosList.appendChild(scenarioItem);
      }
      resultsDiv.innerHTML = "";
      resultsDiv.appendChild(scenariosList);
    } else {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.innerText = "No scenarios found.";
      resultsDiv.innerHTML = "";
      resultsDiv.appendChild(noResultsMessage);
    }
  } catch (error) {
    console.error(error);
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "An error occurred while generating the scenarios.";
    resultsDiv.innerHTML = "";
    resultsDiv.appendChild(errorMessage);
  }

  generateButton.disabled = false;
}

if (OPENAI_API_KEY === undefined) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "OpenAI API key not set.";
}
