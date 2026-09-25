# ⚡ NeoPass Extension (v1.5.5)

**NeoPass (NeoExamShield)** — An AI-powered browser assistant tailored for students taking online tests on **Iamneo**, **Examly**, **HackerRank**, **NPTEL**, **Codility**, and other online exam portals.

---

> [!IMPORTANT]
> **GitHub Email & OTP Verification Gateway**: All users verify their access directly via their GitHub email using a 6-digit OTP code in the popup.
> **Gemini Sidebar**: Built-in sleek Gemini Right Sidebar UI for instant AI assistance and automatic screen question solving!

> [!WARNING]
> **Educational Purposes Only**: This extension is intended strictly for educational purposes and browser utility automation. Please use responsibly and ethically in accordance with your institution's academic guidelines.

---

## ✨ Features

- **🔑 GitHub OTP Verification**: Quick login using GitHub Email & 6-Digit OTP verification directly inside the extension popup.
- **✨ Gemini Sidebar Assistant**: Modern, dockable right sidebar with glassmorphic dark theme, gradient accents, and real-time streaming AI answers.
- **⚡ Automatic Screen Question Solver**:
  - Automatically extracts MCQ or coding questions displayed on your screen.
  - One-click **⚡ Solve Screen** button in the Gemini Sidebar header.
- **🖱️ Drag-to-Copy Auto Solver**: Highlight or copy any question text on the page to automatically send it to the Gemini Sidebar for step-by-step solutions.
- **🛡️ Rate Limit & 429 Auto-Retry**: Automatic exponential backoff retry system that prevents API rate limiting errors.
- **📋 Copy & Paste Override**: Bypasses copy-paste restrictions on blocked exam fields using Drag-and-Drop paste (`Alt+P`) or direct pasting (`Ctrl+V`).
- **⌨️ Auto-Type Code Solver (`Alt+T`)**: Automatically inputs code solutions character-by-character into code editors when copy-paste is restricted.
- **🌿 NPTEL & Portal Solvers**: Built-in support for NPTEL Wildlife Ecology, Conservation Geography, and Forest Management courses.
- **⚙️ Multiple AI Provider Support**: Use your choice of AI providers including OpenAI, Google Gemini, Anthropic Claude, DeepSeek, or custom endpoints.

---

## ⬇️ Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/nishwapandiyan/Neo_pass.git
   ```
2. Open Chrome/Brave/Edge and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click on **Load unpacked** and select the folder containing the project files (or `dist/chromium/extension`).
5. Your **NeoPass** extension is ready to use!

---

## 🚀 How to Use

1. **Verify Access**:
   - Click the NeoPass extension icon in your browser toolbar.
   - Enter your GitHub-registered Email or Username and click **"Send OTP Verification Code"**.
   - Input the 6-digit OTP code to unlock the full extension interface.

2. **Set Up AI Provider**:
   - Open the **Settings** tab in the popup.
   - Select your preferred AI provider (Google Gemini, OpenAI, Claude, DeepSeek, or Custom API).
   - Enter your API Key and click **"Test Connection"**.

3. **Gemini Sidebar Assistant**:
   - Press <kbd>Alt</kbd> + <kbd>C</kbd> (or <kbd>Option</kbd> + <kbd>C</kbd> on Mac) to open/close the Gemini Sidebar.
   - Click **"⚡ Solve Screen"** to automatically solve the current question visible on your screen.
   - Highlight or copy any text on the page to automatically submit it to the Gemini Sidebar!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>C</kbd> / <kbd>Option</kbd> + <kbd>C</kbd> | Toggle **Gemini Sidebar Assistant** |
| <kbd>Alt</kbd> + <kbd>A</kbd> / <kbd>Option</kbd> + <kbd>A</kbd> | Solve Iamneo / Examly question on screen |
| <kbd>Alt</kbd> + <kbd>T</kbd> / <kbd>Option</kbd> + <kbd>T</kbd> | Auto-type coding solution letter by letter |
| <kbd>Alt</kbd> + <kbd>P</kbd> / <kbd>Option</kbd> + <kbd>P</kbd> | Paste via drag-and-drop when standard paste is blocked |
| <kbd>Ctrl</kbd> + <kbd>V</kbd> / <kbd>Cmd</kbd> + <kbd>V</kbd> | Direct paste into restricted text boxes |
| <kbd>Alt</kbd> + <kbd>,</kbd> | Solve NPTEL MCQs from selected text |
| <kbd>Ctrl</kbd> + <kbd>.</kbd> | Quick AI search for selected text |

---

## 🤝 Contribute or Add NPTEL Dataset

If you want to contribute to the NPTEL question database, follow these steps:

1. Fork this repository
2. Open your NPTEL assignment page in the browser
3. Open browser developer tools (F12 or right-click > Inspect)
4. Go to the Console tab
5. Copy and paste the script from `nptel.txt` in the repository
6. Run the script by pressing Enter
7. The script will extract all questions and correct answers from the page
8. Copy the output JSON data
9. Update the `data/nptel.json` file with the new questions and answers
10. Create a pull request to contribute your additions back to the main repository

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
