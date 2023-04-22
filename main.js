document.addEventListener('DOMContentLoaded', function() {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const outputContainer = document.getElementById('output-container');
  const generateButton = document.getElementById('generate-button');
  
  generateButton.addEventListener('click', async () => {
    const inputText = document.getElementById('input-text').value;
    const inputUrl = document.getElementById('input-url').value;
    const prompt = `Scenario: ${inputText}\nSource: ${inputUrl}`;
    
    try {
      const completions = await openai.complete({
        engine: 'davinci',
        prompt: prompt,
        maxTokens: 60,
        n: 1,
        stop: '\n',
        temperature: 0.5,
      });

      const scenarios = completions.choices.map(choice => choice.text.trim());
      const outputHtml = scenarios.map(scenario => `<p>${scenario}</p>`).join('');
      outputContainer.innerHTML = outputHtml;
    } catch (err) {
      console.log(err);
      outputContainer.innerHTML = '<p>Error generating scenarios. Please try again.</p>';
    }
  });
});
