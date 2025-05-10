
document.body.innerHTML = `
  <h1>SDK Integration</h1>
  <div id="buttonContainer"></div>
  <div id="output">
    <h3>Output:</h3>
    <p id="result"></p>
  </div>
`;

const buttonContainer = document.getElementById("buttonContainer");
const buttons = [
  { id: "getTokenBtn", text: "Get Token" },
  { id: "getAppDataBtn", text: "Get App Data" },
  { id: "closeDetailBtn", text: "Close Detail" },
];

buttons.forEach((buttonInfo) => {
  const button = document.createElement("button");
  button.id = buttonInfo.id;
  button.innerText = buttonInfo.text;
  buttonContainer.appendChild(button);
  buttonContainer.appendChild(document.createElement("br")); 
});

import("https://cdn.jsdelivr.net/npm/vconsole/dist/vconsole.min.js");
import(
  "https://cdn.jsdelivr.net/npm/@grabjs/mobile-kit-bridge-sdk/dist/index.js"
);

const vConsole = new window.VConsole();
console.log("vConsole initialized");

window.WrappedkartaPOIAppHandler = wrapModule(window, "kartaPOIAppHandler");

document
  .getElementById("getTokenBtn")
  .addEventListener("click", async function () {
    try {
      const response = await window.WrappedkartaPOIAppHandler.invoke(
        "GetToken",
        {}
      );
      document.getElementById(
        "result"
      ).textContent = `Token: ${response.result}`;
    } catch (error) {
      document.getElementById("result").textContent = `Error: ${error.message}`;
    }
  });

document
  .getElementById("getAppDataBtn")
  .addEventListener("click", async function () {
    try {
      const response = await window.WrappedkartaPOIAppHandler.invoke(
        "GetAppData",
        {}
      );
      document.getElementById(
        "result"
      ).textContent = `App Data: ${JSON.stringify(response.result)}`;
    } catch (error) {
      document.getElementById("result").textContent = `Error: ${error.message}`;
    }
  });

document
  .getElementById("closeDetailBtn")
  .addEventListener("click", async function () {
    try {
      const response = await window.WrappedkartaPOIAppHandler.invoke(
        "CloseDetail",
        { bySubmission: true }
      );
      document.getElementById(
        "result"
      ).textContent = `Detail Closed: ${JSON.stringify(response.result)}`;
    } catch (error) {
      document.getElementById("result").textContent = `Error: ${error.message}`;
    }
  });
