document.addEventListener('DOMContentLoaded', async () => {
    const currentUrlEl = document.getElementById('current-url');
    const scanBtn = document.getElementById('scan-btn');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');

    // Get current tab
    let currentTab = null;
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
        if (currentTab && currentTab.url) {
            currentUrlEl.textContent = currentTab.url;
        } else {
            currentUrlEl.textContent = "Unable to read URL";
            scanBtn.disabled = true;
        }
    } catch (e) {
        currentUrlEl.textContent = "Error reading tab";
        scanBtn.disabled = true;
    }

    scanBtn.addEventListener('click', async () => {
        if (!currentTab || !currentTab.url) return;

        // Chrome system URLs can't be scanned or scripted
        if (currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('edge://')) {
            showError("System pages cannot be scanned.");
            return;
        }

        setLoading(true);

        try {
            // 1. Extract page text via content script injection
            let pageText = "";
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: () => document.body.innerText,
                });
                if (results && results[0] && results[0].result) {
                    // Truncate text to avoid massive payloads (max 50,000 chars per backend schema)
                    pageText = results[0].result.substring(0, 45000);
                }
            } catch (err) {
                console.warn("Could not extract page text:", err);
                // Proceed anyway, just without text analysis
            }

            // 2. Call backend API
            const response = await fetch("http://localhost:8000/api/v1/phishing/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: currentTab.url,
                    page_text: pageText || undefined
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail ? JSON.stringify(errData.detail) : "Server returned " + response.status);
            }

            const data = await response.json();
            renderResult(data);

        } catch (error) {
            showError("Failed to scan: " + error.message);
        } finally {
            setLoading(false);
        }
    });

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

        // Elements
        const verdictBanner = document.getElementById('verdict-banner');
        const verdictTitle = document.getElementById('verdict-title');
        const scoreValue = document.getElementById('score-value');
        const tierValue = document.getElementById('tier-value');
        
        // Populate basic info
        verdictTitle.textContent = data.verdict;
        scoreValue.textContent = data.score;
        tierValue.textContent = data.tier;

        // Reset classes
        verdictBanner.className = 'verdict-banner tier-' + data.tier;
        tierValue.className = 'tier-badge badge-' + data.tier;

        // Reasons
        const reasonsContainer = document.getElementById('reasons-container');
        const reasonsList = document.getElementById('reasons-list');
        reasonsList.innerHTML = '';
        
        if (data.reasons && data.reasons.length > 0) {
            reasonsContainer.classList.remove('hidden');
            data.reasons.forEach(reason => {
                const li = document.createElement('li');
                li.textContent = reason;
                reasonsList.appendChild(li);
            });
        } else {
            reasonsContainer.classList.add('hidden');
        }

        // Breakdown
        if (data.breakdown) {
            document.getElementById('breakdown-container').classList.remove('hidden');
            document.getElementById('bd-rule').textContent = data.breakdown.rule_score;
            document.getElementById('bd-ml').textContent = data.breakdown.ml_score;
            document.getElementById('bd-llm').textContent = data.breakdown.llm_score || 0;
        }
    }
});
