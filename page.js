// Create the basic structure of the page early
document.body.innerHTML = `
  <h1>SDK Integration</h1>
  <div id="buttonContainer"></div>
  <div id="output">
    <h3>Output:</h3>
    <p id="result"></p>
  </div>
`;

// Create the buttons dynamically (even before scripts are loaded)
const buttonContainer = document.getElementById('buttonContainer');
const buttons = [
  { id: 'getTokenBtn', text: 'Get Token' },
  { id: 'getAppDataBtn', text: 'Get App Data' },
  { id: 'closeDetailBtn', text: 'Close Detail' }
];

buttons.forEach(buttonInfo => {
  const button = document.createElement('button');
  button.id = buttonInfo.id;
  button.innerText = buttonInfo.text;
  buttonContainer.appendChild(button);
  buttonContainer.appendChild(document.createElement('br'));  // Add line break after button
});

// Dynamically load vConsole and the Grab SDK in parallel
const vConsoleScript = document.createElement('script');
vConsoleScript.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js";
document.body.appendChild(vConsoleScript);

const sdkScript = document.createElement('script');
sdkScript.src = "https://cdn.jsdelivr.net/npm/@grabjs/mobile-kit-bridge-sdk/dist/index.js";
document.body.appendChild(sdkScript);

// Wait for both scripts to load before proceeding
Promise.all([new Promise((resolve, reject) => {
  vConsoleScript.onload = resolve;
  vConsoleScript.onerror = reject;
}), new Promise((resolve, reject) => {
  sdkScript.onload = resolve;
  sdkScript.onerror = reject;
})])
  .then(() => {
    // Once both scripts are loaded, initialize vConsole for debugging
    const vConsole = new window.VConsole();
    console.log('vConsole initialized');

    // Wrap the kartyPOIAppHandler
    window.WrappedkartaPOIAppHandler = wrapModule(window, 'kartaPOIAppHandler');

    // Handle button click events and invoke SDK methods
    document.getElementById('getTokenBtn').addEventListener('click', async function() {
      try {
        const response = await window.WrappedkartaPOIAppHandler.invoke('GetToken', {});
        document.getElementById('result').textContent = `Token: ${response.result}`;
      } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
      }
    });

    document.getElementById('getAppDataBtn').addEventListener('click', async function() {
      try {
        const response = await window.WrappedkartaPOIAppHandler.invoke('GetAppData', {});
        document.getElementById('result').textContent = `App Data: ${JSON.stringify(response.result)}`;
      } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
      }
    });

    document.getElementById('closeDetailBtn').addEventListener('click', async function() {
      try {
        const response = await window.WrappedkartaPOIAppHandler.invoke('CloseDetail', { bySubmission: true });
        document.getElementById('result').textContent = `Detail Closed: ${JSON.stringify(response.result)}`;
      } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
      }
    });
  })
  .catch((error) => {
    console.error('Error loading scripts:', error);
  });
