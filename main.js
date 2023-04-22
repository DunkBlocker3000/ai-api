document.addEventListener("DOMContentLoaded", function () {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const generateBtn = document.getElementById("generate-btn");
  const inputBox = document.getElementById("input");
  const outputDiv = document.getElementById("output");

  generateBtn.addEventListener("click", function () {
    const inputText = inputBox.value.trim();

    if (inputText !== "") {
      generateScenarios(inputText, openaiApiKey);
    }
  });

  async function generateScenarios(inputText, apiKey) {
    try {
      const completions = await openai.complete({
        engine: "text-davinci-002",
        prompt:
          "Generate possible scenarios based on the following text:\n\n" +
          inputText +
          "\n\n1.",
        maxTokens: 60,
        n: 5,
        stop: ["2."],
      }, apiKey);

      const scenarios = completions.choices.map((choice) => choice.text.trim());

      outputDiv.innerHTML = scenarios.map((scenario, i) => `${i + 1}. ${scenario}<br />`).join("");
    } catch (error) {
      console.error(error);
      outputDiv.innerHTML = "Error generating scenarios.";
    }
  }
});
