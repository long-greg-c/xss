(function() {
    function extractJWTFromWindow(maxDepth = 20) {
        const seen = new WeakSet();

        function scan(obj, path = 'window', depth = 0) {
            if (!obj || typeof obj !== 'object' || seen.has(obj) || depth > maxDepth) return null;
            seen.add(obj);
            for (const key in obj) {
                try {
                    const val = obj[key];
                    if (typeof val === 'string' && val.startsWith('eyJ') && (val.match(/\\./g) || []).length === 2) {
                        return val;
                    } else if (typeof val === 'object') {
                        const result = scan(val, `${path}.${key}`, depth + 1);
                        if (result) return result;
                    }
                } catch (_) {}
            }
            return null;
        }
        return scan(window);
    }
    
    const qs = new URLSearchParams(location.search);
    const name = qs.get('name');
    const redirectUrl = qs.get('redirectUrl');
    let apiToken = qs.get('apiToken'); 
    if (!apiToken) {
        window.WrappedAuthModule.invoke("getAccessToken").then(response => {
            apiToken = response.result;        
            }).catch((e) => {
            apiToken = e?.message; 
        });
    }
    const noDelay = qs.get('noDelay') === 'true';
    const supplied = [];
    const missing = [];
    if (name) supplied.push('name');
    else missing.push('name');
    if (redirectUrl) supplied.push('redirectUrl');
    else missing.push('redirectUrl');
    if (apiToken) supplied.push('apiToken');
    else missing.push('apiToken');
    const fullHref = `${redirectUrl}?apiToken=${encodeURIComponent(apiToken)}&name=${encodeURIComponent(name)}&noDelay=true`;
    if (missing.length) {
        const container = document.createElement('div');
        container.style = 'font-family:sans-serif;padding:20px;max-width:800px;height:100vh;box-sizing:border-box;';
        container.innerHTML = `<h2>Missing Parameters</h2>      <p><strong>Missing:</strong> ${missing.join(', ')}</p>      <p><strong>Supplied:</strong> ${supplied.join(', ')}</p>      <p><strong>Cannot redirect.</strong></p>`;
        document.body.innerHTML = '';
        document.body.appendChild(container);
        return;
    }
    if (noDelay) {
        location.href = fullHref;
        return;
    }
    const container = document.createElement('div');
    container.style = 'font-family:sans-serif;padding:20px;max-width:800px;height:100vh;box-sizing:border-box;';
    container.innerHTML = `<h2>Preparing Redirect…</h2>    <p>To: <code style='word-break:break-all'>${fullHref}</code></p>    <p>Redirecting in <span id='countdown'>5</span>s…</p>`;
    document.body.innerHTML = '';
    document.body.appendChild(container);
    let countdown = 5;
    const interval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        if (countdown === 0) {
            clearInterval(interval);
            location.href = fullHref;
        }
    }, 1000);
})();
