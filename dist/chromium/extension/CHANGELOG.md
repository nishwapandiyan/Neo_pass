# Changelog

All notable changes to NeoPass are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.5.5] – 2026-09-11

### Changed
- Updated extension backend API base URL from `api.neopass.space` → `https://freeneopass.vercel.app` across `popup.js`, `worker.js`, and `data/inject/screenshare.js`.
- Updated installation/download docs to use the GitHub project zip URL (`…/archive/refs/heads/main.zip`) instead of release download links.
- Updated update-notification links in `worker.js` to point to the GitHub project zip for consistency.

### Bumped
- Version → `1.5.5`

---

## [1.5.4] – 2025

### Added
- Screenshare Bypass feature (Pro): **Share Tab/Window**, **Share Blank Screen**, and **Share Frozen Screen** modes.
- `screenshare.js` and `screenshare-bridge.js` injected for supported exam portals.

### Changed
- Auth gating for Pro screenshare moved to runtime JS rather than manifest level.

---

## [1.5.0] – 2025

### Added
- Pro tier with **Managed AI by NeoPass** (GPT-5.1, no API key required).
- NeoBrowser Solver access for Pro users.
- Increased rate limits for Pro tier.
- Priority support for Pro users.

### Changed
- Multiple AI provider support: OpenAI, Google Gemini, Anthropic Claude, custom endpoints.
- Settings tab redesigned for API key configuration workflow.

---

## [1.4.x] – 2025

### Added
- `anti-anti-debug.js` — runtime debugger detection bypass injected into `MAIN` world at `document_start`.
- `rightclickmenu.js` — context-menu override for restricted pages.
- `mock_code/` — NeoExamShield impersonation bundle (`mock_manifest.json`, `minifiedBackground.js`, `minifiedContent-script.js`, `rules.json`).

---

## [1.3.x] – 2024

### Added
- NPTEL question database (`data/nptel.json`) with community-contributed answers.
- `Alt+Comma` keyboard shortcut for NPTEL MCQ solving from selected text.
- `nptel.txt` extractor script for contributors.

---

## [1.2.x] – 2024

### Added
- AI-powered chatbot with **Stealth Mode** (`chatbot.js`).
- `Alt+C` shortcut to open/close chatbot.
- Custom paste via drag-and-drop (`customPaste.js`, `Alt+P`).
- Tab-switching bypass logic.

---

## [1.1.x] – 2024

### Added
- Initial NeoExamShield Bypass — extension mimics NeoExamShield identity so exam portals remain satisfied.
- MCQ solver shortcuts: `Ctrl+Comma` and `Ctrl+Period`.
- HackerRank solver (`Alt+K`, BETA).

---

## [1.0.0] – 2024

### Added
- Initial public release of NeoPass free extension.
- `popup.html` / `popup.js` settings and UI.
- `worker.js` service worker for background tasks.
- `contentScript.js` core injection.
- Copy override and clipboard bypass (`copyOverride.js`).
- Manifest V3 structure targeting Chromium.
