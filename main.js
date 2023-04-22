let apiKey;

function setApiKey() {
  apiKey = process.env.OPENAI_API_KEY;
}

async function analyzeDocumentation() {
  const response = await fetch(apiUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(text, "text/html");
  const endpointList = htmlDocument.querySelectorAll("section[id^=endpoints]");
  if (!endpointList.length) {
    throw new Error("Could not find any API endpoints on the page");
  }
  const scenarios = [];
  endpointList.forEach((endpoint) => {
    const title = endpoint.querySelector("h1, h2, h3, h4, h5, h6");
    if (!title) {
      return;
    }
    const titleText = title.innerText.trim();
    if (!titleText) {
      return;
    }
    const methodList = endpoint.querySelectorAll("table>tbody>tr");
    if (!methodList.length) {
      return;
    }
    methodList.forEach((method) => {
      const methodCells = method.querySelectorAll("td");
      if (!methodCells.length) {
        return;
      }
      const scenario = {
        title: `${titleText} - ${methodCells[0].innerText.trim()}`,
        steps: [],
      };
      methodCells[1]
        .querySelectorAll("code")
        .forEach((param) => scenario.steps.push(`Set ${param.innerText.trim()} to [value].`));
      methodCells[2]
        .querySelectorAll("code")
        .forEach((param) => scenario.steps.push(`Set ${param.innerText.trim()} to [value].`));
      scenarios.push(scenario);
    });
  });
  return scenarios;
}

function generateScenarioList(scenarios) {
  const scenarioList = document.getElementById("scenarioList");
  scenarioList.innerHTML = "";
  if (!scenarios.length) {
    scenarioList.innerText = "No scenarios were found in the documentation.";
    return;
  }
  scenarios.forEach((scenario, index) => {
    const scenarioDiv = document.createElement("div");
    const scenarioTitle = document.createElement("h3");
    scenarioTitle.innerText = `${index + 1}. ${scenario.title}`;
    scenarioDiv.appendChild(scenarioTitle);
    const stepList = document.createElement("ul");
    scenario.steps.forEach((step) => {
      const stepItem = document.createElement("li");
      stepItem.innerText = step.replace("[value]", "______");
      stepList.appendChild(stepItem);
    });
    scenarioDiv.appendChild(stepList);
    scenarioList.appendChild(scenarioDiv);
  });
}

async function generateScenarios() {
  const apiUrl = document.getElementById("apiUrl").value
