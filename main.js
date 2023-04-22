const scenariosList = document.getElementById("scenariosList");

function generateScenariosFromUrl() {
  const urlInput = document.getElementById("urlInput").value;
  fetch(urlInput)
    .then((response) => response.text())
    .then((data) => generateScenarios(data));
}

function generateScenariosFromText() {
  const apiTextArea = document.getElementById("apiTextArea").value;
  generateScenarios(apiTextArea);
}

function generateScenarios(apiData) {
  // Logic to parse the API data and generate scenarios
  // ...

  // Example scenarios to be added to the list
  const scenarios = ["Scenario 1", "Scenario 2", "Scenario 3"];

  // Clear the list of previous scenarios
  scenariosList.innerHTML = "";

  // Add the new scenarios to the list
  for (const scenario of scenarios) {
    const listItem = document.createElement("li");
    listItem.innerText = scenario;
    scenariosList.appendChild(listItem);
  }
}
