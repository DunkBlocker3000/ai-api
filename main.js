const openaiApiKey = process.env.OPENAI_API_KEY; // Set your API key as an environment variable

const input = document.getElementById("input");
const generateBtn = document.getElementById("generate-btn");
const createTestsBtn = document.getElementById("create-tests-btn");
const scenariosContainer = document.getElementById("scenarios-container");

generateBtn.addEventListener("click", async () => {
  const prompt = "Provide a comprehensive list of scenarios to test the software described in this text.";
  const model = "text-davinci-002";
  const completions = await openai.complete({
    engine: "davinci-codex",
    prompt,
    maxTokens: 1024,
    n: 1,
    temperature: 0.5,
    apiKey: openaiApiKey,
    model
  });

  const { data } = completions.choices[0];
  const scenarios = data.text.trim().split("\n").map((s) => s.trim());

  let html = "";
  for (let i = 0; i < scenarios.length; i++) {
    html += `<label><input type="radio" name="scenario" value="${i}"> ${scenarios[i]}</label><br>`;
  }
  scenariosContainer.innerHTML = html;

  createTestsBtn.style.display = "";
});

createTestsBtn.addEventListener("click", () => {
  const scenarioIndex = document.querySelector('input[name="scenario"]:checked').value;

  const hasApi = input.value.toLowerCase().includes("api");
  if (hasApi) {
    const scenario = scenariosContainer.querySelectorAll("input")[scenarioIndex].nextSibling.textContent.trim();

    // Create API file for scenario and output in zip file
    // TODO: Implement logic for creating API file and zip file
  } else {
    const scenarios = scenariosContainer.querySelectorAll("input").length;
    let csv = "Scenario,Steps to Execute,Expected Outcome\n";
    for (let i = 0; i < scenarios; i++) {
      const scenario = scenariosContainer.querySelectorAll("input")[i].nextSibling.textContent.trim();
      csv += `"${scenario}","",""\n`;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "test-cases.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
});
