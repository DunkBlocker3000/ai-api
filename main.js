const apiUrlInput = document.getElementById("apiUrl");
const generateBtn = document.getElementById("generateBtn");
const scenariosDiv = document.getElementById("scenarios");

apiUrlInput.addEventListener("input", () => {
  generateBtn.disabled = apiUrlInput.value.trim() === "";
});

generateBtn.addEventListener("click", async () => {
  scenariosDiv.innerHTML = "Loading...";
  generateBtn.disabled = true;
  const apiUrl = apiUrlInput.value.trim();

  try {
    const response = await fetch(apiUrl);
    const apiJson = await response.json();
    const scenarios = generateScenarios(apiJson);
    scenariosDiv.innerHTML = scenarios.length
      ? scenarios.join("<br>")
      : "No scenarios found.";
  } catch (err) {
    scenariosDiv.innerHTML = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
  }
});

function generateScenarios(apiJson) {
  // Your scenario generation code here
  // ...
}
