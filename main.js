const urlInput = document.getElementById("url");
const generateButton = document.querySelector("button[type=submit]");
const scenarioDiv = document.getElementById("scenarios");

async function generateScenarios(event) {
  event.preventDefault();
  const url = urlInput.value.trim();
  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }
  generateButton.disabled = true;
  generateButton.textContent = "Generating...";
  try {
    const response = await fetch(url);
    const text = await response.text();
    const scenarios = generateScenarioList(text);
    scenarioDiv.innerHTML = "";
    for (const scenario of scenarios) {
      const pre = document.createElement("pre");
      pre.textContent = scenario;
      scenarioDiv.appendChild(pre);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Generate Scenarios";
  }
}

function generateScenarioList(text) {
  const urls = new Set();
  const scenarioSet = new Set();
  const baseUrlRegex = /^https?:\/\/[^/]+/;
  const urlRegex = /\bhttps?:\/\/\S+/g;
  let match;
  while ((match = urlRegex.exec(text))) {
    urls.add(match[0]);
  }
  for (const url of urls) {
    const baseUrl = baseUrlRegex.exec(url)[0];
    scenarioSet.add(`Given a valid API key for ${baseUrl}, when I send a GET request to ${url}, then I expect to receive a response with status code 200.`);
    scenarioSet.add(`Given an invalid API key for ${baseUrl}, when I send a GET request to ${url}, then I expect to receive a response with status code 401.`);
  }
  return Array.from(scenarioSet);
}

generateButton.addEventListener("click", generateScenarios);
