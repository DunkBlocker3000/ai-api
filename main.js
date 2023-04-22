const apiUrlInput = document.getElementById('apiUrl');
const generateBtn = document.getElementById('generateBtn');
const loadingMsg = document.getElementById('loadingMsg');
const scenariosList = document.getElementById('scenarios');

generateBtn.addEventListener('click', () => {
  loadingMsg.textContent = 'Loading...';
  scenariosList.innerHTML = '';
  generateScenarios(apiUrlInput.value)
    .then(scenarios => {
      loadingMsg.textContent = '';
      for (const scenario of scenarios) {
        const li = document.createElement('li');
        li.textContent = scenario;
        scenariosList.appendChild(li);
      }
    })
    .catch(error => {
      loadingMsg.textContent = '';
      console.error(error);
    });
});

async function generateScenarios(apiUrl) {
  const api = await openApi.load(apiUrl);
  const generator = new ScenarioGenerator(api);
  return generator.generate();
}
