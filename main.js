const generateScenariosButton = document.getElementById("generate-scenarios-button");
const scenarioList = document.getElementById("scenario-list");

async function analyzeDocumentation() {
  const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: "Python function to get a list of unique values from a list of dictionaries\n\n```python\nlist_of_dicts = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}, {'name': 'Alice', 'age': 20}, {'name': 'Charlie', 'age': 25}]\n```",
      max_tokens: 60,
      temperature: 0.7,
      n: 1,
      stop: "\n```",
    }),
  });
  const data = await response.json();
  const code = data.choices[0].text;
  return code.trim();
}

async function generateScenarioList() {
  const code = await analyzeDocumentation();
  const endpointList = ["Create User", "Get User", "Update User", "Delete User"];
  const regex = /\n\s*# Function to (.+?)\n\s*def \w+\(/g;
  const matches = Array.from(code.matchAll(regex), (m) => m[1]);
  const scenarioList = matches.filter((match) => endpointList.includes(match));
  return scenarioList;
}

async function generateScenarios() {
  generateScenariosButton.disabled = true;
  scenarioList.innerHTML = "";
  const scenarioListItems = await generateScenarioList();
  scenarioListItems.forEach((scenario) => {
    const li = document.createElement("li");
    li.textContent = scenario;
    scenarioList.appendChild(li);
  });
  generateScenariosButton.disabled = false;
}

generateScenariosButton.onclick = generateScenarios;
