const generateButton = document.getElementById("generate-button");
const createTestsButton = document.getElementById("create-tests-button");
const scenarioList = document.getElementById("scenario-list");
const inputBox = document.getElementById("input");

const prompt = "Provide a comprehensive list of scenarios to test the software described in this text.";

const openaiApiKey = process.env.OPENAI_API_KEY; // Make sure to set this as an environment variable

generateButton.addEventListener("click", async () => {
  try {
    const scenarios = await generateScenarios(inputBox.value);
    if (scenarios.length === 0) {
      alert("No scenarios generated!");
      return;
    }
    scenarioList.innerHTML = "";
    scenarios.forEach((scenario) => {
      const scenarioDiv = document.createElement("div");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "scenario";
      radio.value = scenario;
      scenarioDiv.appendChild(radio);
      const label = document.createElement("label");
      label.innerHTML = scenario;
      scenarioDiv.appendChild(label);
      scenarioList.appendChild(scenarioDiv);
    });
    createTestsButton.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Failed to generate scenarios: " + err.message);
  }
});

async function generateScenarios(text) {
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not set");
  }
  const openai = new OpenAI(openaiApiKey);
  const completions = await openai.complete({
    prompt: prompt,
    max_tokens: 200,
    n: 1,
    stop: ["\n\n"],
    temperature: 0.5,
    engine: "text-davinci-002",
    prompt_context: text,
  });
  if (!completions.choices || completions.choices.length === 0) {
    throw new Error("Failed to generate scenarios");
  }
  return completions.choices[0].text.trim().split("\n");
}

createTestsButton.addEventListener("click", () => {
  const selectedScenario = document.querySelector(
    'input[name="scenario"]:checked'
  );
  if (!selectedScenario) {
    alert("Please select a scenario!");
    return;
  }
  const text = selectedScenario.value;
  const filename = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (/api/i.test(text)) {
    // create api file
    const content = `// TODO: Implement tests for ${text}`;
    downloadFile(`${filename}.js`, content);
  } else {
    // create csv file
    const content = `Scenario,
