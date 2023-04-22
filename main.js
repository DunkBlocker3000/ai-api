const openai = new OpenAI(api_key);

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
        scenarioItem
