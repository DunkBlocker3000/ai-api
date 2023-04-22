document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const generateButton = document.getElementById("generate");

  generateButton.addEventListener("click", async () => {
    const text = input.value.trim();
    if (text === "") {
      output.innerHTML = "Please enter some API documentation!";
      return;
    }

    const prompt = `Generate test scenarios based on this API documentation:\n\n${text}\n\n---\n\nScenario 1:`;
    const completions = await openai.complete({
      engine: "text-davinci-002",
      prompt,
      maxTokens: 1024,
      n: 1,
      stop: ["Scenario"],
    });

    const scenario = completions.choices[0].text.trim();
    output.innerHTML = `Generated test scenario:<br/><br/>${scenario}`;
  });
});
