document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE = "http://localhost:8000/api/v1";
    let token = null;

    // Views
    const viewLogin = document.getElementById('view-login');
    const viewScan = document.getElementById('view-scan');

    // Login Elements
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const loginSpinner = document.getElementById('login-spinner');
    const loginBtnText = loginBtn.querySelector('.btn-text');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Scanner Elements
    const currentUrlEl = document.getElementById('current-url');
    const scanBtn = document.getElementById('scan-btn');
    const spinner = document.getElementById('spinner');
    const btnText = scanBtn.querySelector('.btn-text');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');

    // Flagging Elements
    const flagLegitBtn = document.getElementById('flag-legit-btn');
    const flagMaliciousBtn = document.getElementById('flag-malicious-btn');
    const flagStatus = document.getElementById('flag-status');

    let currentTab = null;
    let currentDomain = null;

    // Initialization: Check Token
    chrome.storage.local.get(['aegis_token'], async (res) => {
        if (res.aegis_token) {
            token = res.aegis_token;
            showScanView();
        } else {
            showLoginView();
        }
        await initCurrentTab();
    });

    async function initCurrentTab() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTab = tabs[0];
            if (currentTab && currentTab.url) {
                let activeUrl = currentTab.url;
                try {
                    const parsedUrl = new URL(currentTab.url);
                    if (parsedUrl.hostname === 'localhost' && parsedUrl.searchParams.has('blocked') && parsedUrl.searchParams.has('url')) {
                        activeUrl = parsedUrl.searchParams.get('url');
                    }
                    currentDomain = new URL(activeUrl).hostname;
                } catch (e) {
                    currentDomain = activeUrl;
                }
                currentUrlEl.textContent = activeUrl;

                // Load background scan result
                chrome.storage.local.get(['latest_scan', 'latest_url'], (res) => {
                    if (res.latest_url === activeUrl && res.latest_scan) {
                        renderResult(res.latest_scan);
                        flagStatus.classList.add('hidden');
                        flagLegitBtn.disabled = false;
                        flagMaliciousBtn.disabled = false;
                    }
                });
            } else {
                currentUrlEl.textContent = "Unable to read URL";
                scanBtn.disabled = true;
            }
        } catch (e) {
            currentUrlEl.textContent = "Error reading tab";
            scanBtn.disabled = true;
        }
    }

    // View Toggles
    function showLoginView() {
        viewLogin.style.display = 'block';
        viewScan.style.display = 'none';
    }

    function showScanView() {
        viewLogin.style.display = 'none';
        viewScan.style.display = 'block';
    }

    // Login Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        if (!email || !password) return;

        loginBtn.disabled = true;
        loginBtnText.classList.add('hidden');
        loginSpinner.classList.remove('hidden');
        loginError.classList.add('hidden');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Login failed");
            }

            const data = await res.json();
            token = data.access_token;
            chrome.storage.local.set({ aegis_token: token });
            showScanView();
        } catch (err) {
            loginError.textContent = err.message;
            loginError.classList.remove('hidden');
        } finally {
            loginBtn.disabled = false;
            loginBtnText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        token = null;
        chrome.storage.local.remove('aegis_token');
        showLoginView();
        resultContainer.classList.add('hidden');
    });

    // Manual Scanner Logic
    scanBtn.addEventListener('click', async () => {
        if (!currentTab || !currentTab.url) return;
        if (currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('edge://')) {
            showError("System pages cannot be scanned.");
            return;
        }

        setLoading(true);
        try {
            let pageText = "";
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: () => document.body.innerText,
                });
                if (results && results[0] && results[0].result) {
                    pageText = results[0].result.substring(0, 45000);
                }
            } catch (err) {
                console.warn("Could not extract page text:", err);
            }

            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/phishing/check`, {
                method: "POST",
                headers,
                body: JSON.stringify({ url: currentTab.url, page_text: pageText || undefined })
            });

            if (!response.ok) {
                throw new Error("Server returned " + response.status);
            }

            const data = await response.json();
            renderResult(data);
            
            // Reset flag status for new scan
            flagStatus.classList.add('hidden');
            flagLegitBtn.disabled = false;
            flagMaliciousBtn.disabled = false;

        } catch (error) {
            showError("Failed to scan: " + error.message);
        } finally {
            setLoading(false);
        }
    });

    // Flagging Logic
    const sendFlag = async (flagType, endpoint, payload) => {
        if (!currentDomain || !token) return;
        
        flagLegitBtn.disabled = true;
        flagMaliciousBtn.disabled = true;
        
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                flagStatus.textContent = flagType === 'whitelist' 
                    ? "Added to your personal whitelist!" 
                    : "Thank you! Flag recorded.";
                flagStatus.className = "flag-status success";

                if (flagType === 'whitelist') {
                    let activeUrl = currentTab.url;
                    try {
                        const parsedUrl = new URL(currentTab.url);
                        if (parsedUrl.hostname === 'localhost' && parsedUrl.searchParams.has('url')) {
                            activeUrl = parsedUrl.searchParams.get('url');
                        }
                    } catch(e) {}
                    chrome.tabs.update(currentTab.id, { url: activeUrl });
                    setTimeout(() => window.close(), 1000);
                }
            } else {
                throw new Error("Failed");
            }
        } catch (e) {
            flagStatus.textContent = "Error submitting flag.";
            flagStatus.className = "flag-status error";
            flagLegitBtn.disabled = false;
            flagMaliciousBtn.disabled = false;
        }
        flagStatus.classList.remove('hidden');
    };

    flagLegitBtn.addEventListener('click', () => sendFlag('whitelist', '/phishing/whitelist', { domain: currentDomain }));
    flagMaliciousBtn.addEventListener('click', () => sendFlag('malicious', '/phishing/blocklist', { domain: currentDomain }));

    function setLoading(isLoading) {
        scanBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            resultContainer.classList.add('hidden');
            errorContainer.classList.add('hidden');
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorContainer.classList.remove('hidden');
        errorMessage.textContent = msg;
        resultContainer.classList.add('hidden');
    }

    function renderResult(data) {
        resultContainer.classList.remove('hidden');
        errorContainer.classList.add('hidden');

        document.getElementById('verdict-title').textContent = data.verdict;
        document.getElementById('score-value').textContent = data.final_score;
        document.getElementById('tier-value').textContent = data.tier;

        document.getElementById('verdict-banner').className = 'verdict-banner tier-' + data.tier;
        document.getElementById('tier-value').className = 'tier-badge badge-' + data.tier;

        const reasonsList = document.getElementById('reasons-list');
        reasonsList.innerHTML = '';
        if (data.reasons && data.reasons.length > 0) {
            document.getElementById('reasons-container').classList.remove('hidden');
            data.reasons.forEach(reason => {
                const li = document.createElement('li');
                li.textContent = reason;
                reasonsList.appendChild(li);
            });
        } else {
            document.getElementById('reasons-container').classList.add('hidden');
        }

        if (data.breakdown) {
            document.getElementById('breakdown-container').classList.remove('hidden');
            document.getElementById('bd-rule').textContent = data.breakdown.rule_score;
            document.getElementById('bd-ml').textContent = data.breakdown.ml_score;
            document.getElementById('bd-llm').textContent = data.breakdown.llm_score || 0;
        }
    }
});
