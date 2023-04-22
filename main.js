const generateScenariosBtn = document.getElementById("generate-btn");

generateScenariosBtn.addEventListener("click", () => {
    const apiInput = document.getElementById("api-input").value;
    if (!apiInput) {
        alert("Please enter API documentation URL or Text");
        return;
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
        alert("Please set OPENAI_API_KEY environment variable");
        return;
    }

    generateScenarios(apiInput, openaiApiKey);
});

async function generateScenarios(apiInput, apiKey) {
    const prompt = `Generate test scenarios for this API documentation: ${apiInput}`;
    const model = "text-davinci-002";
    const apiUrl = "https://api.openai.com/v1/engines/" + model + "/completions";

    const requestBody = {
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        stop: "\n",
        temperature: 0.7
    };

    if (apiInput.startsWith("http")) {
        try {
            const response = await fetch(apiInput);
            if (!response.ok) {
                throw new Error("Failed to fetch API documentation");
            }
            const text = await response.text();
            requestBody["text"] = text;
        } catch (error) {
            alert(error.message);
            return;
        }
    } else {
        requestBody["text"] = apiInput;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Failed to generate scenarios");
        }

        const data = await response.json();
        const scenarios = data.choices[0].text;
        const scenariosContainer = document.getElementById("scenarios-container");
        scenariosContainer.innerText = scenarios;
    } catch (error) {
        alert(error.message);
    }
}
