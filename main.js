const generateScenarios = async () => {
  const submitButton = document.querySelector("#submit-button");
  submitButton.disabled = true;

  const promptInput = document.querySelector("#prompt");
  const prompt = promptInput.value;

  const temperatureInput = document.querySelector("#temperature");
  const temperature = parseFloat(temperatureInput.value);

  const maxTokensInput = document.querySelector("#max-tokens");
  const maxTokens = parseInt(maxTokensInput.value);

  const nScenariosInput = document.querySelector("#n-scenarios");
  const nScenarios = parseInt(nScenariosInput.value);

  const outputDiv = document.querySelector("#output");
  outputDiv.innerHTML = "";

  const model = "text-davinci-002";
  const endpoint = "https://api.openai.com/v1/engines/" + model + "/completions";

  const responseList = await Promise.all(
    Array.from(Array(nScenarios).keys()).map(async () => {
      const data = {
        prompt: prompt,
        temperature: temperature,
        max_tokens: maxTokens,
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sk}`,
        },
        body: JSON.stringify(data),
      });
      const responseJSON = await response.json();
      return responseJSON.choices[0].text;
    })
  );

  const scenarioList = responseList.map((response) => response.trim());
  generateScenarioList(scenarioList);
  submitButton.disabled = false;
};

const generateScenarioList = (scenarioList) => {
  const outputDiv = document.querySelector("#output");

  const scenarioListHTML = scenarioList
    .map((scenario) => {
      return `
      <div class="scenario">
        <p>${scenario}</p>
      </div>
    `;
    })
    .join("");

  outputDiv.innerHTML = scenarioListHTML;

  const copyButtonList = document.querySelectorAll(".copy-button");

  copyButtonList.forEach((button, i) => {
    button.onclick = () => {
      navigator.clipboard.writeText(scenarioList[i]);
      alert("Copied scenario to clipboard!");
    };
  });
};

const analyzeDocumentation = async () => {
  const submitButton = document.querySelector("#submit-doc-button");
  submitButton.disabled = true;

  const docInput = document.querySelector("#documentation");
  const documentText = docInput.value;

  const model = "text-davinci-002";
  const endpoint = "https://api.openai.com/v1/engines/" + model + "/completions";

  const data = {
    prompt: "Analyze the following documentation and list out potential use cases:",
    temperature: 0.5,
    max_tokens: 1024,
    prompt_suffix: `\n\nDocumentation:\n${documentText}`,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sk}`,
    },
    body: JSON.stringify(data),
  });

  const responseJSON = await response.json();
  const scenarioList = responseJSON.choices[0].text.trim().split("\n");

  generateScenarioList(scenarioList);
  submitButton.disabled = false;
};

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.querySelector("#submit-button");
  submitButton.onclick = generateScenarios;

  const submitDocButton = document.querySelector("#submit-doc-button");
  submitDocButton.onclick = analyzeDocumentation;
});
