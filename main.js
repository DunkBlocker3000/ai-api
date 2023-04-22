const api = window.openai;
const generateScenariosBtn = document.getElementById('generate-scenarios-btn');
const createTestsBtn = document.getElementById('create-tests-btn');

generateScenariosBtn.addEventListener('click', async () => {
  const inputText = document.getElementById('input-text').value.trim();
  if (!inputText) {
    alert('Please enter some text');
    return;
  }

  generateScenariosBtn.disabled = true;
  generateScenariosBtn.textContent = 'Generating...';

  const prompt = "Provide a comprehensive list of scenarios to test the software described in this text.";
  const completions = await api.Completion.create({
    engine: 'davinci',
    prompt: prompt,
    maxTokens: 60,
    n: 3,
    stop: '\n\n',
    temperature: 0.5,
    promptOverrides: {
      prompt: prompt + '\n' + inputText
    }
  });
  
  const scenarioList = document.createElement('ul');
  completions.choices.forEach((choice, index) => {
    const scenario = document.createElement('li');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'scenario';
    radio.value = index;
    if (index === 0) {
      radio.checked = true;
    }
    const label = document.createElement('label');
    label.textContent = choice.text.trim();
    label.htmlFor = `scenario-${index}`;

    scenario.appendChild(radio);
    scenario.appendChild(label);
    scenarioList.appendChild(scenario);
  });
  
  createTestsBtn.style.display = 'block';
  document.getElementById('scenarios').innerHTML = '';
  document.getElementById('scenarios').appendChild(scenarioList);
  generateScenariosBtn.disabled = false;
  generateScenariosBtn.textContent = 'Generate Scenarios';
});

createTestsBtn.addEventListener('click', async () => {
  const selectedRadio = document.querySelector('input[name="scenario"]:checked');
  const selectedScenario = selectedRadio.value;
  const scenarioText = completions.choices[selectedScenario].text.trim();
  
  createTestsBtn.disabled = true;
  createTestsBtn.textContent = 'Creating Tests...';

  const filename = 'scenarios.zip';
  const contentType = 'application/zip';
  
  const { generateTests, hasAPI } = generateTest(scenarioText);
  
  if (hasAPI) {
    const zip = new JSZip();
    const apiFolder = zip.folder('API');
    generateTests.forEach((test, index) => {
      apiFolder.file(`api-${index}.json`, JSON.stringify(test, null, 2));
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, filename);
    });
  } else {
    const csvData = generateCSV(generateTests);
    const blob = new Blob([csvData],
