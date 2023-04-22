const generateButton = document.getElementById('generate-button');
const scenarioList = document.getElementById('scenario-list');

generateButton.addEventListener('click', async () => {
  const inputText = document.getElementById('input-text');
  const text = inputText ? inputText.value : null;  // null check added here

  if (!text) {
    console.error('Input text is null or empty.');
    return;
  }

  try {
    const response = await fetch('/generate-scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const { scenarios } = await response.json();

    scenarioList.innerHTML = '';

    scenarios.forEach((scenario, index) => {
      const scenarioItem = document.createElement('li');

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'scenario';
      input.value = index;

      const label = document.createElement('label');
      label.innerText = scenario;

      scenarioItem.appendChild(input);
      scenarioItem.appendChild(label);

      scenarioList.appendChild(scenarioItem);
    });
  } catch (error) {
    console.error(`Failed to generate scenarios: ${error.message}`);
  }
});
