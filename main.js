const generateBtn = document.getElementById('generate-btn');
const createTestsBtn = document.getElementById('create-tests-btn');
const scenarioList = document.getElementById('scenario-list');

generateBtn.addEventListener('click', async () => {
  const inputText = document.getElementById('input-text').value;
  if (!inputText) {
    return;
  }

  try {
    const response = await fetch('/generate-scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: inputText
      })
    });
    if (response.status === 200) {
      const scenarioData = await response.json();
      const scenarios = scenarioData.choices.map((choice) => choice.text);
      renderScenarioList(scenarios);
      createTestsBtn.style.display = 'block';
    } else {
      throw new Error(`Failed to generate scenarios: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    alert(`Failed
