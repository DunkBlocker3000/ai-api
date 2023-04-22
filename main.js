const form = document.getElementById("api-form");
const resultContainer = document.getElementById("result-container");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultContainer.innerHTML = "";

  const url = event.target.url.value;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const scenarios = extractScenarios(data);
    renderScenarios(scenarios);
  } catch (error) {
    console.error(error);
    resultContainer.textContent = "An error occurred while fetching data from the API";
  }
});

function extractScenarios(data) {
  const scenarios = [];

  for (const key in data) {
    const value = data[key];
    if (typeof value === "object" && value !== null) {
      scenarios.push({ name: key, request: value });
    }
  }

  return scenarios;
}

function renderScenarios(scenarios) {
  if (scenarios.length === 0) {
    resultContainer.textContent = "No scenarios found in API response";
    return;
  }

  const scenariosList = document.createElement("ul");
  scenarios.forEach((scenario) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = scenario.name;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const result = document.createElement("pre");
      resultContainer.innerHTML = "";
      result.textContent = JSON.stringify(scenario.request, null, 2);
      resultContainer.appendChild(result);
    });
    listItem.appendChild(link);
    scenariosList.appendChild(listItem);
  });

  resultContainer.appendChild(scenariosList);
}
