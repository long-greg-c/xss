// Dynamically import the SDK from the CDN
import('https://cdn.jsdelivr.net/npm/@grabjs/mobile-kit-bridge-sdk/dist/index.js')
  .then(() => {
    // Dynamically load vConsole for debugging
    const vConsoleScript = document.createElement('script');
    vConsoleScript.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js";
    document.body.appendChild(vConsoleScript);

    // Once vConsole is loaded, instantiate it
    vConsoleScript.onload = () => {
      const vConsole = new window.VConsole();
      console.log('vConsole initialized');  // Confirmation that vConsole is active
    };

    // Use wrapModule to instantiate the wrapped version of the module
    window.WrappedkartaPOIAppHandler = wrapModule(window, 'kartaPOIAppHandler');

    // Function to build the page dynamically
    function buildPage() {
      // Create and append title
      const title = document.createElement('h1');
      title.textContent = 'SDK Integration';
      document.body.appendChild(title);

      // Create and append button container
      const buttonContainer = document.createElement('div');
      document.body.appendChild(buttonContainer);

      // Create buttons dynamically
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

      // Create and append output area
      const outputDiv = document.createElement('div');
      const outputTitle = document.createElement('h3');
      outputTitle.innerText = 'Output:';
      outputDiv.appendChild(outputTitle);
      const resultPara = document.createElement('p');
      resultPara.id = 'result';
      outputDiv.appendChild(resultPara);
      document.body.appendChild(outputDiv);

      // Handle button click events
      document.getElementById('getTokenBtn').addEventListener('click', async function() {
        try {
          const response = await window.WrappedkartaPOIAppHandler.invoke('GetToken', {});
          resultPara.textContent = `Token: ${response.result}`;
        } catch (error) {
          resultPara.textContent = `Error: ${error.message}`;
        }
      });

      document.getElementById('getAppDataBtn').addEventListener('click', async function() {
        try {
          const response = await window.WrappedkartaPOIAppHandler.invoke('GetAppData', {});
          resultPara.textContent = `App Data: ${JSON.stringify(response.result)}`;
        } catch (error) {
          resultPara.textContent = `Error: ${error.message}`;
        }
      });

      document.getElementById('closeDetailBtn').addEventListener('click', async function() {
        try {
          const response = await window.WrappedkartaPOIAppHandler.invoke('CloseDetail', { bySubmission: true });
          resultPara.textContent = `Detail Closed: ${JSON.stringify(response.result)}`;
        } catch (error) {
          resultPara.textContent = `Error: ${error.message}`;
        }
      });
    }

    // Build the page once the SDK is loaded and wrapped
    buildPage();
  })
  .catch((error) => {
    console.error('Error loading the SDK:', error);
  });
