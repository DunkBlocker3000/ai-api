const generateButton = document.querySelector('#generate-button');
const textArea = document.querySelector('#text-area');
const scenarioList = document.querySelector('#scenario-list');

generateButton.addEventListener('click', async () => {
  const text = textArea.value;
  if (text.trim() === '') {
    alert('Please enter some text');
    return;
  }

  const response = await fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      prompt: `Provide a comprehensive list of scenarios to test the software described in this text:\n\n${text}`,
      max_tokens: 60,
      n: 1,
      stop: ['\n\n']
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate scenarios: ${response.status}`);
  }

  const data = await response.json();

  const scenarios = data.choices[0].text.trim().split('\n');

  if (scenarios.length === 0) {
    alert('No scenarios were generated');
    return;
  }

  scenarioList.innerHTML = '';
  scenarios.forEach((scenario, index) => {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'scenario';
    radioInput.id = `scenario-${index}`;
    radioInput.value = scenario;

    const radioLabel = document.createElement('label');
    radioLabel.setAttribute('for', `scenario-${index}`);
    radioLabel.innerText = scenario;

    const listItem = document.createElement('li');
    listItem.appendChild(radioInput);
    listItem.appendChild(radioLabel);

    scenarioList.appendChild(listItem);
  });
});
