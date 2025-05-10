(function () {
  debugger;
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://jarvis.geo.azure.myteksi.net/codeless-portal/page/EcdR6wFAjtOJqWrkFbmdy3g==';
  document.body.appendChild(iframe);

  // Function to extract JWT from the iframe's window
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


    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        if (iframe.contentWindow) {
          resolve(scan(iframe.contentWindow)); 
        } else {
          reject("Unable to access iframe contentWindow");
        }
      };

      iframe.onerror = () => {
        reject("Iframe loading error");
      };
    });
  }

  const qs = new URLSearchParams(location.search);
  const name = qs.get("name");
  const redirectUrl = qs.get("redirectUrl");

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

  const fullHref = `${redirectUrl}?apiToken=${encodeURIComponent(
    apiToken
  )}&name=${encodeURIComponent(name)}&noDelay=true`;

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

})();
