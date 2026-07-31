# Aegis Documentation

## Overview
Aegis is a real-time, AI-powered phishing and fraud detection platform. It provides immediate analysis of URLs and financial transactions to block malicious activity before it reaches the end user. By utilizing a tiered detection model, Aegis balances sub-millisecond response times with deep contextual analysis. The architecture is mapped to the National Institute of Standards and Technology Cybersecurity Framework, specifically focusing on the Identify, Protect, and Detect functions to ensure a standardized approach to threat mitigation.

---

## How it Works
Aegis does not rely on a single model for every request. Instead, it uses a three-layer cascade architecture to optimize for speed, cost, and accuracy. When a URL or transaction is checked, it passes through the following layers.

### Layer One: Rule Engine
Every request first passes through deterministic checks. For URLs, the system analyzes the top-level domain against a blocklist, calculates Shannon entropy to detect randomly generated domains, and uses Levenshtein distance to identify brand impersonation such as distinguishing between a legitimate domain and a spoofed variant. For transactions, the engine verifies the transaction amount against the user's historical average and checks the frequency of recent activity.

### Layer Two: Machine Learning Classifier
If the rule engine does not immediately flag the input as highly critical, the data is passed to a machine learning model. The URL classifier is trained on the PhishTank dataset to identify malicious URL structures. The transaction model uses an Isolation Forest algorithm trained on synthetic behavioral data to detect anomalous spending patterns or geographic mismatches.

### Layer Three: LLM Cascade
If the composite score from the rule engine and the machine learning model falls within an ambiguous band, typically a score between thirty and seventy, the system escalates the analysis. If page text is available, a large language model analyzes the content for brand spoofing, urgency language, and credential harvesting intent. This deliberate escalation ensures that expensive and latency-heavy API calls are only made when deterministic systems are uncertain.

---

## NIST Framework Alignment
Aegis is designed to support enterprise compliance and security postures aligned with NIST guidelines.

- **Detect Function:** Aegis fulfills continuous monitoring requirements by analyzing network traffic and user inputs in real-time. The anomaly detection capabilities provide proactive identification of malicious code, unauthorized execution, and spoofed domains.
- **Protect Function:** By blocking high-risk URLs and flagging anomalous transactions before they are processed, Aegis acts as an access control and protective mechanism. It limits the attack surface available to malicious actors attempting to exploit end users.
- **Respond Function:** The system generates immediate alerts and writes every event to a persistent audit log. This supports incident response teams by providing the contextual data required for mitigation, recovery, and post-incident analysis.

---

## NIST SP 800-63B Digital Identity Alignment
Phishing attacks frequently target user credentials. Aegis aligns with NIST Special Publication 800-63B by actively mitigating credential harvesting attempts. The LLM cascade layer specifically analyzes page text for credential input forms and deceptive prompts. By identifying and blocking these phishing vectors at the network edge or browser level, Aegis supports the integrity of digital identity systems and reduces the risk of credential compromise.

---

## Local Installation from GitHub
To deploy the Aegis platform locally, you must first acquire the source code and configure the environment.

1. Open a terminal window on your local machine.
2. Clone the repository from GitHub using the git clone command followed by the repository URL.
3. Navigate into the newly created Aegis project directory.
4. Set up the backend environment by creating a Python virtual environment and installing the required dependencies from the requirements file.
5. Configure your local environment variables, including your database connection string and the API key for the large language model. The system will gracefully degrade if the API key is omitted.
6. Initialize the database schema and start the FastAPI backend server. Ensure the server is running on local port eight thousand.
7. Navigate to the frontend dashboard directory, install the Node.js dependencies, and start the development server.

---

## Install Extension
The Aegis browser extension operates locally for the demo environment. It monitors page navigations, extracts URLs and page text, and forwards this data to the local backend for analysis.

To install the extension:

1. Ensure the Aegis backend server is running locally on port eight thousand.
2. Open Google Chrome and navigate to the extensions management page by entering chrome slash extensions in the address bar.
3. Enable Developer Mode using the toggle switch located in the top right corner of the extensions page.
4. Click the Load Unpacked button in the top left corner.
5. Select the extension directory from your local Aegis repository.
6. The extension will activate automatically. Pin the Aegis icon to your browser toolbar. As you browse, the extension will evaluate pages and update its icon color to reflect the current threat tier.
