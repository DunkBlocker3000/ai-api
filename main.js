const inputElement = document.getElementById("input");
const generateBtn = document.getElementById("generateBtn");
const outputElement = document.getElementById("output");

generateBtn.addEventListener("click", async () => {
  outputElement.innerHTML = "Generating scenarios...";
  const input = inputElement.value.trim();
  if (input.startsWith("http")) {
    try {
      const response = await fetch(input);
      const text = await response.text();
      const scenarios = await generateScenariosFromApiDoc(text);
      outputElement.innerHTML = scenarios;
    } catch (error) {
      outputElement.innerHTML = `Error generating scenarios: ${error.message}`;
    }
  } else {
    const scenarios = await generateScenariosFromApiDoc(input);
    outputElement.innerHTML = scenarios;
  }
});

async function generateScenariosFromApiDoc(apiDoc) {
  // replace any line breaks or tabs with spaces to help with tokenization
  const cleanApiDoc = apiDoc.replace(/[\n\t]/g, " ");
  
  // generate scenarios using OpenAI's GPT-3 API
  const completions = await openai.complete({
    engine: "text-davinci-002",
    prompt: `Generate test scenarios from the following API documentation:\n\n${cleanApiDoc}\n\nScenario 1:`,
    maxTokens: 1024,
    n: 1,
    stop: "Scenario"
  });
  
  const scenarios = completions.choices[0].text.trim();
  return scenarios;
}
