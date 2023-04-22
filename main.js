window.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const textarea = document.getElementById('textarea');
  const generateBtn = document.getElementById('generateBtn');
  const output = document.getElementById('output');

  generateBtn.addEventListener('click', async () => {
    output.innerText = 'Generating scenarios...';
    let input;
    if (urlInput.value) {
      const response = await fetch(urlInput.value);
      input = await response.text();
    } else if (textarea.value) {
      input = textarea.value;
    } else {
      output.innerText = 'Please provide a URL or enter API documentation in the text box.';
      return;
    }

    const data = {
      model: 'text-davinci-002',
      prompt: `Generate test scenarios for the following API documentation:\n${input}`,
      temperature: 0.5,
      max_tokens: 60,
      n: 1,
      stop: ['\n\n']
    };
    
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    output.innerText = result.choices[0].text;
  });
});
