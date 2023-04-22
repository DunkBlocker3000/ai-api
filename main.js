// get input elements
const urlInput = document.getElementById('url-input');
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');

// handle generate button click
generateBtn.addEventListener('click', async () => {
  // get API documentation
  const apiDoc = urlInput.value
    ? await fetchApiDoc(urlInput.value)
    : textInput.value.trim();

  // generate test scenarios
  const testScenarios = await generateTestScenarios(apiDoc);

  // display test scenarios
  displayTestScenarios(testScenarios);
});

// function to fetch API documentation from URL
async function fetchApiDoc(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to fetch API documentation');
    }
    const data = await response.text();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// function to generate test scenarios using OpenAI
async function generateTestScenarios(apiDoc) {
  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Generate test scenarios for API documentation:\n\n${apiDoc}\n\n`,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });
    const { choices } = await response.json();
    const testScenarios = choices.map(choice => choice.text.trim());
    return testScenarios;
  } catch (err) {
    console.error(err);
  }
}

// function to display test scenarios
function displayTestScenarios(testScenarios) {
  const outputElement = document.getElementById('output');
  outputElement.innerHTML = '';
  if (testScenarios.length > 0) {
    const heading = document.createElement('h2');
    heading.textContent = 'Generated test scenarios:';
    outputElement.appendChild(heading);
    const list = document.createElement('ul');
    testScenarios.forEach(testScenario => {
      const listItem = document.createElement('li');
      listItem.textContent = testScenario;
      list.appendChild(listItem);
    });
    outputElement.appendChild(list);
  } else {
    const message = document.createElement('p');
    message.textContent = 'No test scenarios generated.';
    outputElement.appendChild(message);
  }
}
