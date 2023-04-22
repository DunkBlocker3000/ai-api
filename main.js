const generateButton = document.getElementById("generate-button");
const createTestsButton = document.getElementById("create-tests-button");
const scenariosDiv = document.getElementById("scenarios");

generateButton.addEventListener("click", async () => {
  scenariosDiv.innerHTML = "";
  createTestsButton.disabled = true;

  const text = document.getElementById("text").value;
  const response = await fetch("/generate-scenarios", {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to generate scenarios: ${response.status} ${response.statusText}`);
  }

  const { scenarios } = await response.json();

  scenarios.forEach((scenario) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "scenario";
    radio.value = scenario;

    const label = document.createElement("label");
    label.textContent = scenario;

    const br = document.createElement("br");

    scenariosDiv.appendChild(radio);
    scenariosDiv.appendChild(label);
    scenariosDiv.appendChild(br);
  });

  createTestsButton.disabled = false;
});

createTestsButton.addEventListener("click", async () => {
  const selectedScenario = document.querySelector('input[name="scenario"]:checked');

  if (!selectedScenario) {
    alert("Please select a scenario.");
    return;
  }

  const response = await fetch("/create-tests", {
    method: "POST",
    body: JSON.stringify({ scenario: selectedScenario.value }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create tests: ${response.status} ${response.statusText}`);
  }

  const { downloadUrl, type } = await response.json();

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `tests.${type}`;
  link.click();
});
