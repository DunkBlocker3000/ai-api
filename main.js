// Set up OpenAI API key
const apiKey = "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";

function generateScenarios() {
  const docUrl = document.getElementById('docUrl').value;
  const endpointList = analyzeDocumentation(docUrl);
  const scenarioList = generateScenarioList(endpointList);
  const scenarioListElem = document.getElementById('scenarioList');
  scenarioListElem.innerHTML = '';
  for (const scenario of scenarioList) {
    const scenarioElem = document.createElement('p');
    scenarioElem.innerText = scenario;
    scenarioListElem.appendChild(scenarioElem);
  }
}

async function analyzeDocumentation(docUrl) {
  // Call OpenAI API to analyze documentation
  const prompt = `Please analyze the documentation at this URL: ${docUrl}`;
  const result = await getOpenAIResponse(prompt, apiKey);
  const endpointList = JSON.parse(result.choices[0].text);
  return endpointList;
}

function generateScenarioList(endpointList) {
  const scenarioList = [];
  for (const endpoint of endpointList) {
    const scenario = generateScenario(endpoint);
    scenarioList.push(scenario);
  }
  return scenarioList;
}

function generateScenario(endpoint) {
  const method = endpoint.method.toUpperCase();
  const path = endpoint.path;
  const requiredParams = endpoint.required_params;
  const optionalParams = endpoint.optional_params;
  const scenario = `${method} ${path}\n`;
  if (requiredParams.length > 0) {
    scenario += 'Required Parameters:\n';
    for (const param of requiredParams) {
      scenario += `- ${param}\n`;
    }
  }
  if (optionalParams.length > 0) {
    scenario += 'Optional Parameters:\n';
    for (const param of optionalParams) {
      scenario += `- ${param}\n`;
    }
  }
  return scenario;
}

async function getOpenAIResponse(prompt, apiKey) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      'prompt': prompt,
      'temperature': 0.7,
      'max_tokens': 60,
      'n': 1,
      'stop': '\n'
    })
  };
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', requestOptions);
  const data = await response.json();
  return data;
}
