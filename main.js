const openaiApiKey = process.env.OPENAI_API_KEY;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const scenariosDiv = document.querySelector('#scenarios');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    scenariosDiv.innerHTML = 'Loading...';

    const url = document.querySelector('#url').value;
    const text = document.querySelector('#text').value;

    if (!url && !text) {
      scenariosDiv.innerHTML = 'Please enter a URL or text.';
      return;
    }

    const content = url ? await fetchUrl(url) : text;
    const scenarios = await generateScenarios(content);

    scenariosDiv.innerHTML = '';
    scenarios.forEach((scenario, i) => {
      const scenarioDiv = document.createElement('div');
      const header = document.createElement('h2');
      const stepsList = document.createElement('ol');
      header.innerText = `Scenario ${i + 1}`;
      scenario.steps.forEach((step) => {
        const stepItem = document.createElement('li');
        stepItem.innerText = step;
        stepsList.appendChild(stepItem);
      });
      scenarioDiv.appendChild(header);
      scenarioDiv.appendChild(stepsList);
      scenariosDiv.appendChild(scenarioDiv);
    });
  });
});

async function fetchUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  return text;
}

async function generateScenarios(text) {
  const openai = new OpenAI(openaiApiKey);
  const prompt = `Generate test scenarios based on the following:\n${text}\n\nScenario 1:`;
  const completions = await openai.complete({
    engine: 'text-davinci-002',
    prompt,
    maxTokens: 2048,
    n: 1,
    stop: 'Scenario'
  });
  const scenarios = [];
  completions.choices.forEach((choice) => {
    const text = choice.text.trim();
    const steps = text.split('\n').slice(1);
    scenarios.push({ steps });
  });
  return scenarios;
}
