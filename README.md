# Desafio Mobile - Test Automation Suite

![WebdriverIO](https://img.shields.io/badge/WebdriverIO-9.x-EA5906?style=flat-square&logo=webdriverio&logoColor=white)
![Appium](https://img.shields.io/badge/Appium-2.x-662D91?style=flat-square&logo=appium&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![BrowserStack](https://img.shields.io/badge/BrowserStack-F48024?style=flat-square&logo=browserstack&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Report-2.x-brightgreen?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

End-to-end mobile automation test suite for the [WDIO Demo App](https://github.com/webdriverio/native-demo-app), covering navigation, login and forms flows on Android — running locally via Appium or in the cloud via BrowserStack.

---

## 🗂 Project Structure

```
desafio-mobile-c4/
├── test/
│   ├── data/
│   │   └── users.json                  # Test data (valid/invalid credentials)
│   ├── helpers/
│   │   └── hooks.js                    # Allure screenshot & environment hooks
│   ├── pageobjects/
│   │   ├── home.page.js
│   │   ├── login.page.js
│   │   └── forms.page.js
│   └── specs/
│       └── app.spec.js                 # All test cases (CT01–CT17)
├── .env                                # Local environment variables (not committed)
├── .env.example                        # Environment variable template
├── wdio.conf.js                        # Local Appium configuration
├── wdio.bs.conf.js                     # BrowserStack configuration
└── package.json
```

---

## ⚙️ Prerequisites

- Node.js 20+
- Java 17+ *(required for Allure Report generation)*
- Appium 2.x *(local execution only)*
- Android SDK / Emulator *(local execution only)*
- BrowserStack account *(cloud execution only)*

---

## 🔧 Environment Setup

**1. Clone the repository:**
```bash
git clone https://github.com/nicmsaraiva/desafio-mobile-c4.git
cd desafio-mobile-c4
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure environment variables:**

Copy the example file and fill in your values:
```bash
cp .env.example .env
```

`.env` for **local** execution:
```env
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=13
ANDROID_APP_PATH=./apps/android.wdio.native.app.v2.2.0.apk
```

`.env` for **BrowserStack** execution:
```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BROWSERSTACK_APP=bs://your_app_id
BS_DEVICE=Google Pixel 7
BS_OS_VERSION=13.0
```

---

## ▶️ Running the Tests

**Run locally (Appium + Emulator):**
```bash
npm test
# or explicitly:
npm run test:bs
```

**Run on BrowserStack:**
```bash
npm run test:bs
```

**Upload APK to BrowserStack:**
```bash
curl -u "USER:KEY" \
  -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
  -F "file=@./apps/android.wdio.native.app.v2.2.0.apk"
```
Copy the returned `app_url` (e.g. `bs://abc123`) into `BROWSERSTACK_APP` in your `.env`.

---

## 📊 Allure Report

**Generate and open the report after a test run:**
```bash
npx allure serve allure-results
```

**Or generate a static HTML report:**
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

The report includes:
- ✅ Test execution summary
- 📸 Screenshots automatically captured on failures
- 🌍 Environment info (device, OS, app, execution date)
- 📋 Full test logs grouped by suite

---

## 🧪 Test Cases

### 🧭 Navigator

| ID | Test | Expected |
|---|---|---|
| CT01 | Display all navigation tabs on home screen | All tabs visible |
| CT02 | Navigate to each tab and return to Home | Each tab accessible |

---

### 🔐 Login

| ID | Test | Expected |
|---|---|---|
| CT03 | Display all login screen fields | Fields visible |
| CT04 | Login with valid credentials | Success modal shown |
| CT05 | Login with wrong password (app behavior) | Success modal shown |
| CT06 | Login with empty fields | Validation errors shown |
| CT07 | Login with invalid email format | Email error shown |

---

### 📝 Forms

| ID | Test | Expected |
|---|---|---|
| CT08 | Display all form elements | All elements visible |
| CT09 | Fill text input and verify result | Input value matches |
| CT10 | Clear text input and verify empty | Result is empty string |
| CT11 | Data-driven input with multiple values | Each value matches |
| CT12 | Toggle switch on and off | State changes |
| CT13 | Select "Appium is awesome" from dropdown | Option selected |
| CT14 | Select "This app is awesome" from dropdown | Option selected |
| CT15 | Submit form and confirm modal (OK) | Modal confirmed |
| CT16 | Submit form and cancel modal | Modal cancelled |
| CT17 | Submit form and click Ask Me Later | Modal dismissed |

---

## 🚀 CI/CD

This project uses **GitHub Actions** to run tests automatically on every push or pull request to `main` and `develop` branches.

**Pipeline steps:**
1. Checkout repository
2. Set up Node.js 20
3. Set up Java 17 *(for Allure CLI)*
4. Install dependencies (`npm ci`)
5. Run tests on BrowserStack
6. Generate Allure Report
7. Upload report as artifact *(retained 30 days)*
8. Upload raw results and logs *(retained 7 days)*

**Accessing the report after a pipeline run:**

`Actions` → select the run → `Artifacts` → download `allure-report-{N}` → open `index.html`

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `BROWSERSTACK_USERNAME` | BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack access key |
| `BROWSERSTACK_APP` | Uploaded app ID (`bs://...`) |

---

## 🏗️ Architecture Decisions

### `hooks.js`
Centralizes all evidence-generation logic shared between `wdio.conf.js` and `wdio.bs.conf.js`. Exposes `afterTestHook` (automatic screenshot capture on failure + Allure attachment) and `writeEnvironmentProperties` (generates `environment.properties` for Allure's Environment tab). Keeps both config files DRY.

### `Page Objects`
Each screen has a dedicated page object class encapsulating element selectors and interaction methods. Tests stay readable and focused on assertions — not on how to interact with elements.

### `users.json`
Externalizes test data for login scenarios. Separates `valid` and `invalid` credential sets, making data-driven tests easy to extend without touching spec files.

### `wdio.conf.js` vs `wdio.bs.conf.js`
Two separate configs — one for local Appium execution, one for BrowserStack. Both share the same `hooks.js` logic. Environment-specific values (device, credentials, build name) are injected via `.env` to keep configs portable across machines and CI.

---

## 🔗 References

- [WebdriverIO Docs](https://webdriver.io/docs/gettingstarted)
- [Appium Docs](https://appium.io/docs/en/latest/)
- [BrowserStack App Automate](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio)
- [Allure Report](https://allurereport.org/docs/)
- [WDIO Demo App](https://github.com/webdriverio/native-demo-app)

---

## 👨‍💻 Author

**Nicolas Saraiva** — Senior QA Engineer  
[LinkedIn](https://www.linkedin.com/in/nicmsaraiva/) · [GitHub](https://github.com/nicmsaraiva)