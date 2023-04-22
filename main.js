document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.querySelector('#generate-btn');
  const inputUrl = document.querySelector('#input-url');
  const inputText = document.querySelector('#input-text');
  const output = document.querySelector('#output');
  
  generateBtn.addEventListener('click', () => {
    const url = inputUrl.value.trim();
    const text = inputText.value.trim();

    if (url === '' && text === '') {
      output.innerHTML = 'Please enter a URL or paste API documentation text.';
      return;
    }

    const data = { url, text };
    fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          output.innerHTML = `Error: ${data.error}`;
        } else {
          output.innerHTML = data.output;
        }
      })
      .catch(error => {
        console.error(error);
        output.innerHTML = 'An error occurred. Please try again later.';
      });
  });
});
