// First, set up the basic structure of the page
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

// Asynchronously load both vConsole and Grab SDK
const loadVConsole = new Promise((resolve, reject) => {
  const vConsoleScript = document.createElement('script');
  vConsoleScript.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js";
  vConsoleScript.onload = resolve;
  vConsoleScript.onerror = reject;
  document.head.appendChild(vConsoleScript); // Load the vConsole script
});

const loadSDK = new Promise((resolve, reject) => {
  const sdkScript = document.createElement('script');
  sdkScript.src = "https://cdn.jsdelivr.net/npm/@grabjs/mobile-kit-bridge-sdk/dist/index.js";
  sdkScript.onload = resolve;
  sdkScript.onerror = reject;
  document.head.appendChild(sdkScript); // Load the Grab SDK script
});

// Wait for both scripts to load
Promise.all([loadVConsole, loadSDK])
  .then(() => {
    // Initialize vConsole once it's loaded
    const vConsole = new window.VConsole();
    console.log('vConsole initialized');  // Log a confirmation

    // Wrap the Grab SDK's kappaPOIAppHandler using wrapModule
    window.WrappedkartaPOIAppHandler = wrapModule(window, 'kartaPOIAppHandler');

    // Now that the SDK is wrapped, let's build the functionality
    setupButtonListeners();
  })
  .catch((error) => {
    console.error('Error loading one of the scripts:', error);
  });

// Function to handle button click events and invoke the SDK methods
function setupButtonListeners() {
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
}
