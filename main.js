const input = document.getElementById('input');
const generateButton = document.getElementById('generate-button');
const scenariosList = document.getElementById('scenarios');

generateButton.addEventListener('click', () => {
  const inputText = input.value.trim();

  if (inputText.length === 0) {
    alert('Please enter API documentation URL or JSON.');
    return;
  }

  let apiUrl = '';
  if (inputText.startsWith('http')) {
    apiUrl = inputText;
  } else {
    try {
      const inputJson = JSON.parse(inputText);
      apiUrl = inputJson.host + inputJson.basePath;
    } catch {
      alert('Invalid input format. Please enter a valid API documentation URL or JSON.');
      return;
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI(apiKey);

  const prompt = `Given the API documentation located at ${apiUrl}, write test scenarios for the following endpoints and methods:\n`;

  const completionsOptions = {
    maxTokens: 1024,
    n: 1,
    stop: ['\n\n'],
    temperature: 0.5,
  };

  scenariosList.innerHTML = '<li>Generating scenarios...</li>';

  openai.complete(prompt, completionsOptions)
    .then(response => {
      const { choices } = response.data;
      const scenarios = choices[0].text.trim().split('\n');

      scenariosList.innerHTML = '';
      scenarios.forEach(scenario => {
        const scenarioItem = document.createElement('li');
        scenarioItem.textContent = scenario;
        scenariosList.appendChild(scenarioItem);
      });
    })
    .catch(error => {
      scenariosList.innerHTML = '<li>An error occurred while generating scenarios. Please try again later.</li>';
      console.error(error);
    });
});
