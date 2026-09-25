# Contributing to NeoPass

Thank you for your interest in contributing! 🎉  
This guide covers everything you need to get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding NPTEL Questions](#adding-nptel-questions)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

By participating in this project, you agree to use it responsibly and ethically.  
This extension is intended for **educational purposes only**. We do not encourage or promote academic dishonesty.

---

## Ways to Contribute

| Type | Examples |
|------|----------|
| 🐛 Bug fixes | Fix broken shortcuts, injection issues, UI glitches |
| 📚 NPTEL data | Add new course question-answer sets to `data/nptel.json` |
| 🌐 Portal support | Add support for new exam portals |
| 📝 Documentation | Improve README, add examples, fix typos |
| 🔒 Security | Responsible disclosure of vulnerabilities |

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (for build scripts)
- [PowerShell](https://learn.microsoft.com/en-us/powershell/) 7+ (for release builds)
- Google Chrome or Chromium (to load the extension unpacked)
- Firefox 142+ (for Firefox builds)

### Install dependencies

```bash
npm install
```

### Load the extension in Chrome (unpacked, for development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked** and select the project root folder
4. The extension is now active — edit files and click 🔄 in `chrome://extensions/` to reload

### Build a release package

```bash
# Chromium release zip → dist/chromium/
npm run build:chromium

# Firefox release zip → dist/firefox/
npm run build:firefox
```

Both commands produce a `.zip` suitable for browser store submission.

---

## Project Structure

```
NeoPass/
├── manifest.json                  # Chrome MV3 manifest
├── popup.html / popup.js          # Extension popup UI + logic
├── worker.js                      # Service worker (background)
├── contentScript.js               # Primary content script
├── devtools.js                    # DevTools detection overlay
├── metadata.json                  # Backend server IPs
├── nptel.txt                      # Extractor script for contributors
├── data/
│   ├── nptel.json                 # NPTEL Q&A database
│   ├── lib/
│   │   └── showdown.min.js        # Markdown → HTML renderer
│   └── inject/
│       ├── anti-anti-debug.js     # Debugger detection bypass (MAIN world)
│       ├── chatbot.js             # AI chatbot overlay
│       ├── content.js             # Portal-specific logic
│       ├── copyOverride.js        # Clipboard write bypass
│       ├── customPaste.js         # Drag-and-drop paste helper
│       ├── exam.js                # Exam portal utilities
│       ├── isolated.js            # Isolated world bridge
│       ├── main.js                # Entry point orchestrator
│       ├── rightclickmenu.js      # Context menu override
│       ├── screenshare.js         # Screenshare bypass (MAIN world)
│       ├── screenshare-bridge.js  # Screenshare message bridge
│       ├── mock_code.js           # Mock extension launcher
│       └── mock_code/             # NeoExamShield impersonation bundle
│           ├── mock_manifest.json
│           ├── minifiedBackground.js
│           ├── minifiedContent-script.js
│           └── rules.json
├── images/                        # Extension icons (16, 48, 128, 256 px)
└── scripts/
    ├── build-chromium-release.ps1
    └── build-firefox-release.ps1
```

---

## Adding NPTEL Questions

The easiest and most impactful contribution is expanding `data/nptel.json`.

### Steps

1. **Fork** this repository on GitHub
2. Open your NPTEL assignment page in Chrome
3. Open DevTools (`F12` → **Console** tab)
4. Paste and run the script from [`nptel.txt`](nptel.txt)
5. Copy the JSON output that appears in the console
6. Open `data/nptel.json` and merge the new entries into the existing array
7. Verify the JSON is valid (e.g. paste into [jsonlint.com](https://jsonlint.com))
8. Commit and open a Pull Request (see below)

### JSON format

```json
[
  {
    "question": "Which of the following best describes...",
    "answer": "The correct option text",
    "course": "Wildlife Ecology"
  }
]
```

---

## Submitting a Pull Request

1. Fork the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes following the existing code style
3. Test your changes by loading the extension unpacked in Chrome
4. Commit with a clear message:
   ```
   feat: add NPTEL conservation-geography week 4 questions
   fix: chatbot not opening on examly.io after portal update
   docs: add Firefox installation instructions
   ```
5. Push and open a PR against `main`
6. Fill in the PR description template and link any related issues

### PR checklist

- [ ] Tested in Chrome (unpacked load)
- [ ] No console errors introduced
- [ ] `data/nptel.json` is valid JSON (if modified)
- [ ] `manifest.json` version is **not** bumped (maintainers handle releases)

---

## Reporting Bugs

Please [open a GitHub Issue](https://github.com/Max-Eee/NeoPass/issues/new) with:

- **Browser & version** (e.g., Chrome 126)
- **Extension version** (visible in `chrome://extensions/`)
- **Steps to reproduce**
- **Expected vs actual behaviour**
- **Screenshots or console errors** (if applicable)

Alternatively, email **[support@neopass.space](mailto:support@neopass.space)**.

---

## Feature Requests

Open a GitHub Issue with the label `enhancement` and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

*Thank you for helping make NeoPass better for everyone!* 🚀
