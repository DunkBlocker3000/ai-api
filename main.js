const generateRequests = async (docUrl, selectedScenarios) => {
  const docText = await fetchDocText(docUrl);
  const scenarios = extractScenarios(docText);
  const requests = scenarios.filter((scenario) => selectedScenarios.includes(scenario.name)).map((scenario) => {
    const requestBody = generateRequestBody(scenario);
    const request = generateCurlRequest(scenario.method, scenario.url, requestBody);
    return request;
  });
  return requests;
};

const fetchDocText = async (docUrl) => {
  const response = await fetch(docUrl);
  const text = await response.text();
  return text;
};

const extractScenarios = (docText) => {
  // Use ChatGPT to extract scenarios
  const prompt = `Extract the scenarios from the following API documentation:\n\n${docText}\n\n`;
  const scenariosText = generateText(prompt);
  const scenarios = JSON.parse(scenariosText);
  return scenarios;
};

const generateRequestBody = (scenario) => {
  // Use ChatGPT to generate request body
  const prompt = `Generate the request body for the following scenario:\n\n${JSON.stringify(scenario, null, 2)}\n\n`;
  const requestBody = generateText(prompt);
  return requestBody;
};

const generateCurlRequest = (method, url, requestBody) => {
  let curlRequest = `curl -X ${method} ${url}`;
  if (requestBody) {
    curlRequest += ` -d '${requestBody}'`;
  }
  return curlRequest;
};

const generateText = async (prompt) => {
  // Use OpenAI API to generate text
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + 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
},
    body:
