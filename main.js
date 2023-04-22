const form = document.querySelector("form");
const urlInput = document.querySelector("#url-input");
const scenarios = document.querySelector("#scenarios");
const note = document.querySelector("#note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  generateScenarios(urlInput.value);
});

async function generateScenarios(url) {
  note.innerText = "Generating scenarios...";
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(text, "text/html");
  const scenariosArray = [];

  // Get all API endpoints
  const endpoints = Array.from(htmlDoc.querySelectorAll("a[href]")).filter(
    (link) =>
      link.getAttribute("href").startsWith("/") ||
      link.getAttribute("href").startsWith("http")
  );

  if (endpoints.length === 0) {
    scenarios.innerHTML = "";
    note.innerText = "No endpoints found on the given API documentation page.";
    return;
  }

  endpoints.forEach((endpoint) => {
    const method = endpoint.closest("tr").querySelector(".method").innerText;
    const href = endpoint.getAttribute("href");
    const description = endpoint.closest("tr").querySelector(".desc").innerText;
    const scenario = `${method} ${href}: ${description}`;
    scenariosArray.push(scenario);
  });

  scenarios.innerHTML = "";
  scenariosArray.forEach((scenario) => {
    const li = document.createElement("li");
    li.innerText = scenario;
    scenarios.appendChild(li);
  });

  note.innerText = `Generated ${scenariosArray.length} scenarios from ${endpoints.length} API endpoints.`;
}
