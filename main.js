const inputForm = document.getElementById("input-form");
inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("input").value.trim();

  if (!input) {
    alert("Please enter text or a URL to generate scenarios.");
    return;
  }

  const engine = "text-davinci-002";
  const prompt = `Please generate 5 scenarios based on the following input:\n\n${input}`;

  const apiKey = process.env.OPENAI_API_KEY; // Remove this line if using browser-compatible API key
  const openai = require("openai"); // Remove this line if using browser-compatible API
  openai.apiKey = apiKey; // Remove this line if using browser-compatible API

  openai.complete({
    engine,
    prompt,
    maxTokens: 60,
    n: 5,
    stop: "\n",
  }).then((response) => {
    const { choices } = response.data;
    const output = document.getElementById("output");
    output.innerHTML = "";
    const ul = document.createElement("ul");
    for (const choice of choices) {
      const li = document.createElement("li");
      li.textContent = choice.text.trim();
      ul.appendChild(li);
    }
    output.appendChild(ul);
  }).catch((err) => console.error(err));
});
