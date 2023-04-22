// This code is not needed if you want the user to input the URL of the API documentation.

const apiUrl = 'https://restful-booker.herokuapp.com/apidoc';

async function getDocumentation() {
    const response = await fetch(apiUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const resources = Array.from(xmlDoc.getElementsByTagName('resource'));
    const scenarios = resources.map(resource => {
        const name = resource.getAttribute('path').split('/').filter(segment => segment !== '').join('-');
        const methods = Array.from(resource.getElementsByTagName('method'));
        const scenarioData = methods.map(method => {