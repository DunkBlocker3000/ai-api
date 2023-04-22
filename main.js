let apiKey;
let apiUrl;
let apiUrlPrefix;

function setApiKey() {
  apiKey = document.getElementById('api-key').value;
}

function setApiUrl() {
  apiUrl = document.getElementById('url-input').value;
  apiUrlPrefix = apiUrl.substring(0, apiUrl.lastIndexOf('/') + 1);
}

async function generateScenarios() {
  setApiKey();
  setApiUrl();
  
  const response = await fetch(apiUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const scenarioElements = doc.querySelectorAll('[data-scenario]');
  const scenarios = [];

  for (let i = 0; i < scenarioElements.length; i++) {
    const scenario = scenarioElements[i].getAttribute('data-scenario');
    const url = scenarioElements[i].getAttribute('data-url');
    const method = scenarioElements[i].getAttribute('data-method');
    const headers = scenarioElements[i].getAttribute('data-headers');
    const body = scenarioElements[i].getAttribute('data-body');

    const headersObj = headers ? JSON.parse(headers) : {};

    if (apiKey && !headersObj.Authorization) {
      headersObj.Authorization = `Bearer ${apiKey}`;
    }

    const options = {
      method: method,
      headers: headersObj,
      mode: 'cors'
    };

    if (body) {
      options.body = body;
    }

    scenarios.push({
      scenario: scenario,
      url: apiUrlPrefix + url,
      options: options
    });
  }

  document.getElementById('scenarios').value = JSON.stringify(scenarios, null, 2);
  document.getElementById('scenarios').disabled = false;
}
