const generateBtn = document.getElementById("generate-btn");
generateBtn.addEventListener("click", generateScenarios);

function generateScenarios() {
  const inputType = document.getElementById("input-type").value;
  const input = document.getElementById("input").value;
  const prompt = `Generate test scenarios for this API documentation:\n\n${input}`;

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const openaiApiEndpoint = "https://api.openai.com/v1/engines/davinci-codex/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openaiApiKey}`,
  };

  const data = {
    prompt,
    max_tokens: 200,
    temperature: 0.5,
    n: 1,
    stop: "\n\n",
  };

  if (inputType === "url") {
    fetch(input)
      .then((response) => response.text())
      .then((text) => {
        data.prompt += `\n\n${text}`;
        generateScenariosHelper(data, headers, openaiApiEndpoint);
      })
      .catch((error) => {
        console.error(`Error fetching URL: ${input}`);
        console.error(error);
      });
  } else if (inputType === "text") {
    generateScenariosHelper(data, headers, openaiApiEndpoint);
  } else {
    console.error(`Invalid input type: ${inputType}`);
  }
}

function generateScenariosHelper(data, headers, openaiApiEndpoint) {
  fetch(openaiApiEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const outputElement = document.getElementById("output");
      outputElement.innerHTML = "";

      data.choices[0].text.split("\n").forEach((scenario) => {
        if (scenario) {
          const scenarioElement = document.createElement("p");
          scenarioElement.innerText = scenario;
          outputElement.appendChild(scenarioElement);
        }
      });
    })
    .catch((error) => {
      console.error("Error generating scenarios:");
      console.error(error);
    });
}
