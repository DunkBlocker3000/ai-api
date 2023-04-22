const endpointList = ["davinci", "curie", "babbage", "ada"];

function generateScenarios() {
  const model = document.getElementById("model").value;
  const prompt = document.getElementById("prompt").value;
  const length = document.getElementById("length").value;
  const apiKey = process.env.OPENAI_API_KEY;
  analyzeDocumentation(model, apiKey)
    .then((result) => {
      const docs = result.data.data;
      const scenarioList = generateScenarioList(docs, prompt, length);
      renderScenarioList(scenarioList);
    })
    .catch((error) => {
      console.log(error);
    });
}

function analyzeDocumentation(model, apiKey) {
  const url = `https://api.openai.com/v1/models/${model}/documentation`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const options = {
    headers,
    method: "GET",
  };
  return fetch(url, options).then((response) => response.json());
}

function generateScenarioList(docs, prompt, length) {
  const scenarioList = [];
  for (const endpoint of endpointList) {
    for (const doc of docs) {
      const promptWithDoc = prompt.replace("[DOCUMENTATION]", doc);
      const promptWithDocAndEndpoint = promptWithDoc.replace(
        "[ENDPOINT]",
        endpoint
      );
      scenarioList.push({
        model: doc,
        endpoint,
        prompt: promptWithDocAndEndpoint,
        length,
      });
    }
  }
  return scenarioList;
}

function renderScenarioList(scenarioList) {
  const container = document.getElementById("scenarios");
  container.innerHTML = "";
  for (const scenario of scenarioList) {
    const scenarioElement = document.createElement("div");
    scenarioElement.className = "scenario";
    scenarioElement.innerHTML = `
      <h3>Scenario:</h3>
      <ul>
        <li><strong>Model:</strong> ${scenario.model}</li>
        <li><strong>Endpoint:</strong> ${scenario.endpoint}</li>
        <li><strong>Prompt:</strong> ${scenario.prompt}</li>
        <li><strong>Length:</strong> ${scenario.length}</li>
      </ul>
    `;
    container.appendChild(scenarioElement);
  }
}
