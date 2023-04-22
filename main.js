const generateScenarios = async () => {
  const input = document.getElementById("api-data").value;
  const apiKey = process.env.OPENAI_API_KEY; // reference OpenAI API Key environment variable
  const prompt = `Given the following API documentation, generate 10 sample test scenarios:\n\n${input}\n\nSample scenario 1:`;
  const requestBody = {
    prompt,
    temperature: 0.7,
    max_tokens: 100,
    n: 10,
    stop: "\n\nSample scenario",
  };
  const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`, // use OpenAI API Key environment variable
    },
    body: JSON.stringify(requestBody),
  });
  const responseBody = await response.json();
  const scenarios = responseBody.choices[0].text
    .split("Sample scenario")
    .slice(1)
    .map((scenario) => scenario.trim());
  return scenarios;
};

const renderScenarios = async () => {
  const scenarios = await generateScenarios();
  const scenariosContainer = document.getElementById("scenarios");
  scenariosContainer.innerHTML = "";
  scenarios.forEach((scenario) => {
    const scenarioEl = document.createElement("div");
    scenarioEl.innerText = scenario;
    scenariosContainer.appendChild(scenarioEl);
  });
};

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", renderScenarios);
