const generateScenarios = async () => {
  const urlInput = document.getElementById("url-input");
  const scenarioList = document.getElementById("scenario-list");
  const generateButton = document.getElementById("generate-button");

  const apiUrl = urlInput.value.trim();
  if (!apiUrl) {
    scenarioList.innerHTML = "Please enter an API documentation URL.";
    return;
  }

  generateButton.disabled = true;
  scenarioList.innerHTML = "Generating scenarios...";

  try {
    const response = await fetch(apiUrl);
    const apiSpec = await response.json();
    const scenarios = generateScenarioList(apiSpec);
    scenarioList.innerHTML = "";
    scenarios.forEach((scenario) => {
      const scenarioItem = document.createElement("div");
      scenarioItem.className = "scenario";
      scenarioItem.innerHTML = `<h3>${scenario.name}</h3><p>${scenario.description}</p><pre><code>${scenario.request}</code></pre>`;
      scenarioList.appendChild(scenarioItem);
    });
  } catch (error) {
    console.error(error);
    scenarioList.innerHTML = `Error generating scenarios: ${error.message}`;
  } finally {
    generateButton.disabled = false;
  }
};

const generateScenarioList = (apiSpec) => {
  const scenarios = [];

  for (const path in apiSpec.paths) {
    const methods = apiSpec.paths[path];
    for (const method in methods) {
      const operation = methods[method];
      const name = operation.operationId || `${method.toUpperCase()} ${path}`;
      const description = operation.description || "";
      const request = generateRequestString(operation);
      scenarios.push({ name, description, request });
    }
  }

  return scenarios;
};

const generateRequestString = (operation) => {
  const requestBody = operation.requestBody;
  const parameters = operation.parameters || [];
  let request = "";

  if (requestBody) {
    const requestBodyString = JSON.stringify(requestBody, null, 2);
    request += `${operation.operationId}:\n\n${requestBodyString}\n\n`;
  }

  for (const parameter of parameters) {
    request += `${parameter.name}: ${parameter.example}\n`;
  }

  return request;
};

document.getElementById("generate-button").onclick = generateScenarios;
