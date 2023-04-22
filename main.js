const apiUrlInput = document.getElementById('apiUrl');
const apiForm = document.getElementById('apiForm');
const scenarioList = document.getElementById('scenarioList');
const selectedScenarios = document.getElementById('selected');
const selectedForm = document.getElementById('selectedScenarios');

apiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiUrl = apiUrlInput.value;
    const scenarioData = await fetch(apiUrl).then(response => response.json());
    renderScenarios(scenarioData);
});

function renderScenarios(scenarios) {
    scenarioList.innerHTML = '';
    scenarios.forEach((scenario, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `scenario-${index}`;
        checkbox.value = JSON.stringify(scenario);
        const label = document.createElement('label');
        label.htmlFor = checkbox.name;
        label.textContent = scenario.name;
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        scenarioList.appendChild(div);
    });
}

selectedForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const options = Array.from(selectedScenarios.options);
    const selected = options.filter(option => option.selected);
    const requests = selected.map(option => JSON.parse(option.value));
    generateRequests(requests);
});

function generateRequests(requests) {
    requests.forEach(request => {
        const { method, url, body } = request;
        const curlCommand = `curl -X ${method} ${url} -d '${JSON.stringify(body)}'`;
        console.log(curlCommand);
    });
}
