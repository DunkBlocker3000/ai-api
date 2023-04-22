let generateScenarios = async (input) => {
    const completions = await openai.complete({
        engine: 'text-davinci-002',
        prompt: `${input}\n\nExample scenarios that could happen as a result of the above text:`,
        maxTokens: 1024,
        n: 1,
        stop: '\n\n',
        temperature: 0.7,
    });
    const scenarioList = document.getElementById('scenario-list');
    scenarioList.innerHTML = '';
    const scenarios = completions.choices[0].text.trim().split('\n');
    scenarios.forEach((scenario) => {
        const scenarioItem = document.createElement('li');
        scenarioItem.innerText = scenario;
        scenarioList.appendChild(scenarioItem);
    });
};

let handleGenerateBtnClick = async () => {
    const inputType = document.getElementById('input-type').value;
    const input = inputType === 'url' ? document.getElementById('url-input').value : document.getElementById('text-input').value;
    if (!input) {
        return;
    }
    await generateScenarios(input);
};

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', handleGenerateBtnClick);
});
