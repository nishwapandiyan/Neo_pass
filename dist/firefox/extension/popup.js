document.addEventListener('DOMContentLoaded', function () {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
                  navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    
    const statusMessage = document.getElementById('statusMessage');
    const mainContent = document.getElementById('mainContent');
    const errorElement = document.getElementById('error');
    const toastOpacityToggle = document.getElementById('toastOpacityToggle');
    const opacityLevelDisplay = document.getElementById('opacityLevel');
    const uninstallButton = document.getElementById('uninstallButton');
    const apiKeyInput = document.getElementById('apiKey');
    const customEndpointInput = document.getElementById('customEndpoint');
    const modelNameInput = document.getElementById('modelName');
    
    // Custom API Configuration elements
    const useCustomAPIToggle = document.getElementById('useCustomAPI');
    const customAPIForm = document.getElementById('customAPIForm');
    const aiProviderSelect = document.getElementById('aiProvider');
    const customEndpointDiv = document.getElementById('customEndpointDiv');
    const testAPIConfigButton = document.getElementById('testAPIConfig');

    const CUSTOM_API_STORAGE_KEYS = ['useCustomAPI', 'aiProvider', 'customEndpoint', 'customAPIKey', 'customModelName'];

    // Debounced auto-save function for API configuration
    let saveTimeout;
    function autoSaveAPIConfig() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            // Always get values from settings tab (single source of configuration)
            const apiKey = document.getElementById('apiKey')?.value?.trim();
            const aiProvider = document.getElementById('aiProvider')?.value;
            const customEndpoint = document.getElementById('customEndpoint')?.value?.trim();
            const modelName = document.getElementById('modelName')?.value?.trim();
            const useCustomAPI = document.getElementById('useCustomAPI')?.checked;

            // Check if user is logged in
            const { loggedIn } = await chrome.storage.local.get(['loggedIn']);
            
            // For non-logged-in users, always require custom API
            // For logged-in users, save only if toggle is enabled and API key is provided
            if ((!loggedIn || useCustomAPI) && apiKey) {
                try {
                    await chrome.storage.local.set({
                        useCustomAPI: true,
                        aiProvider: aiProvider,
                        customEndpoint: customEndpoint,
                        customAPIKey: apiKey,
                        customModelName: modelName
                    });
                    console.log('API configuration auto-saved');
                    // Show a subtle success indication
                    showError('API configuration saved', 1500);
                } catch (error) {
                    console.error('Error auto-saving API configuration:', error);
                    showError('Failed to save API configuration', 2000);
                }
            }
        }, 1000); // Save after 1 second of no changes
    }

    // Function to clear chat history when provider changes
    function clearChatHistoryOnProviderChange() {
        try {
            // Send message to all tabs to clear their chat history
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    try {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'clearChatHistory',
                            reason: 'providerChange'
                        }).catch(() => {
                            // Ignore errors for tabs that can't receive messages
                        });
                    } catch (error) {
                        // Ignore errors
                    }
                });
            });
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }

    // Function to update all shortcuts based on platform
    function updateShortcutsForPlatform() {
        // Define shortcut mappings
        const shortcutMappings = {
            'Option + T': isMac ? 'Option + T' : 'Alt + T',
            'Option + A': isMac ? 'Option + A' : 'Alt + A',
            'Option + K': isMac ? 'Option + K' : 'Alt + K',
            'Option + C': isMac ? 'Option + C' : 'Alt + C',
            'Control + Period [.]': isMac ? 'Control + Period [.]' : 'Ctrl + Period [.]',
            'Control + Comma [,]': isMac ? 'Control + Comma [,]' : 'Ctrl + Comma [,]',
            'Option + Comma [,]': isMac ? 'Option + Comma [,]' : 'Alt + Comma [,]',
            'Option + P': isMac ? 'Option + P' : 'Alt + P'
        };

        // Update all shortcut keys
        document.querySelectorAll('.shortcut-key').forEach(element => {
            const currentText = element.textContent.trim();
            if (shortcutMappings[currentText]) {
                element.textContent = shortcutMappings[currentText];
            }
        });

        // Update the opacity shortcut info text
        const opacityShortcutInfo = document.querySelector('.toggle-info');
        if (opacityShortcutInfo && opacityShortcutInfo.textContent.includes('Shortcut:')) {
            opacityShortcutInfo.textContent = `Shortcut: ${isMac ? 'Option + O' : 'Alt + O'}`;
        }
    }

    // Update chat shortcut display based on platform
    const chatShortcutElement = document.getElementById('chatShortcut');
    if (chatShortcutElement) {
        chatShortcutElement.textContent = isMac ? 'Option+C' : 'Alt+C';
    }

    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active class on buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Function to refresh all tabs - important when changing auth state
    function refreshAllTabs() {
        chrome.tabs.query({}, function(tabs) {
            for (let tab of tabs) {
                chrome.tabs.reload(tab.id);
            }
        });
    }

    // Helper Functions
    function showError(message, duration = 5000) {
        errorElement.innerText = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.innerText = '';
            errorElement.classList.add('hidden');
        }, duration);
    }

    // Show API form for all users (no Pro mode)
    function initFreeUser() {
        const customAPIToggleContainer = document.getElementById('customAPIToggleContainer');
        if (customAPIToggleContainer) customAPIToggleContainer.classList.add('hidden');
        if (useCustomAPIToggle) useCustomAPIToggle.checked = true;
        if (customAPIForm) customAPIForm.classList.remove('hidden');
        autoSaveAPIConfig();
    }

    // GitHub Email + OTP Verification Logic
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const githubEmailInput = document.getElementById('githubEmailInput');
    const githubOtpInput = document.getElementById('githubOtpInput');
    const githubEmailStep = document.getElementById('githubEmailStep');
    const githubOtpStep = document.getElementById('githubOtpStep');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const changeEmailBtn = document.getElementById('changeEmailBtn');
    const toggleTokenInputLink = document.getElementById('toggleTokenInputLink');
    const manualTokenDiv = document.getElementById('manualTokenDiv');
    const connectGithubTokenBtn = document.getElementById('connectGithubTokenBtn');
    const githubTokenInput = document.getElementById('githubTokenInput');
    const disconnectGithubBtn = document.getElementById('disconnectGithubBtn');

    let generatedOtpCode = null;
    let pendingEmail = '';

    function generate6DigitOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function updateGithubProfileUI(user) {
        if (!user) return;
        const avatarUrl = user.avatar_url || 'images/icon48.png';
        const login = user.login || 'user';
        const name = user.name || login;

        const githubAvatarHeader = document.getElementById('githubAvatarHeader');
        const githubUserHeader = document.getElementById('githubUserHeader');
        const githubAvatarCard = document.getElementById('githubAvatarCard');
        const githubNameCard = document.getElementById('githubNameCard');
        const githubLoginCard = document.getElementById('githubLoginCard');

        if (githubAvatarHeader) githubAvatarHeader.src = avatarUrl;
        if (githubUserHeader) githubUserHeader.textContent = `@${login}`;
        if (githubAvatarCard) githubAvatarCard.src = avatarUrl;
        if (githubNameCard) githubNameCard.textContent = name;
        if (githubLoginCard) githubLoginCard.textContent = `@${login}`;
    }

    function showGithubGateway(errorMsg = '') {
        const githubAuthGateway = document.getElementById('githubAuthGateway');
        const mainContent = document.getElementById('mainContent');
        const githubAuthError = document.getElementById('githubAuthError');

        if (githubAuthError) {
            if (errorMsg) {
                githubAuthError.textContent = errorMsg;
                githubAuthError.classList.remove('hidden');
            } else {
                githubAuthError.textContent = '';
                githubAuthError.classList.add('hidden');
            }
        }

        if (githubEmailStep) githubEmailStep.classList.remove('hidden');
        if (githubOtpStep) githubOtpStep.classList.add('hidden');

        if (githubAuthGateway) githubAuthGateway.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('hidden');
    }

    function showMainContent(user) {
        const githubAuthGateway = document.getElementById('githubAuthGateway');
        const mainContent = document.getElementById('mainContent');

        if (githubAuthGateway) githubAuthGateway.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');

        updateGithubProfileUI(user);
    }

    function sendOtpToUser() {
        const email = githubEmailInput ? githubEmailInput.value.trim() : '';
        const githubAuthError = document.getElementById('githubAuthError');

        if (!email) {
            if (githubAuthError) {
                githubAuthError.textContent = 'Please enter your GitHub email or username.';
                githubAuthError.classList.remove('hidden');
            }
            return;
        }

        if (githubAuthError) githubAuthError.classList.add('hidden');

        pendingEmail = email;
        generatedOtpCode = generate6DigitOtp();

        // Reveal Step 2 (OTP Entry)
        if (githubEmailStep) githubEmailStep.classList.add('hidden');
        if (githubOtpStep) githubOtpStep.classList.remove('hidden');
        if (githubOtpInput) {
            githubOtpInput.value = '';
            githubOtpInput.focus();
        }

        // Show notification with the generated 6-digit OTP code
        showError(`OTP Sent! Your 6-Digit Code: ${generatedOtpCode}`, 10000);
    }

    async function verifyUserOtp() {
        const enteredOtp = githubOtpInput ? githubOtpInput.value.trim() : '';
        const githubAuthError = document.getElementById('githubAuthError');

        if (!enteredOtp) {
            if (githubAuthError) {
                githubAuthError.textContent = 'Please enter the 6-digit OTP code.';
                githubAuthError.classList.remove('hidden');
            }
            return;
        }

        if (enteredOtp !== generatedOtpCode) {
            if (githubAuthError) {
                githubAuthError.textContent = 'Invalid OTP code. Please check and try again.';
                githubAuthError.classList.remove('hidden');
            }
            return;
        }

        if (githubAuthError) githubAuthError.classList.add('hidden');

        // OTP Verified successfully!
        const loginName = pendingEmail.includes('@') ? pendingEmail.split('@')[0] : pendingEmail.replace('@', '');
        const githubUser = {
            login: loginName,
            name: loginName,
            email: pendingEmail,
            avatar_url: 'images/icon48.png'
        };

        await chrome.storage.local.set({
            githubConnected: true,
            githubUser: githubUser
        });

        showMainContent(githubUser);
    }

    async function verifyAndConnectGithub(token) {
        const githubAuthError = document.getElementById('githubAuthError');

        if (!token) {
            if (githubAuthError) {
                githubAuthError.textContent = 'Please enter a valid GitHub token.';
                githubAuthError.classList.remove('hidden');
            }
            return;
        }

        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                const githubUser = {
                    login: userData.login,
                    avatar_url: userData.avatar_url,
                    name: userData.name || userData.login,
                    html_url: userData.html_url
                };

                await chrome.storage.local.set({
                    githubConnected: true,
                    githubToken: token,
                    githubUser: githubUser
                });

                showMainContent(githubUser);
            } else {
                const errData = await response.json().catch(() => ({}));
                const msg = errData.message || 'Invalid GitHub token. Access denied.';
                if (githubAuthError) {
                    githubAuthError.textContent = `Error: ${msg}`;
                    githubAuthError.classList.remove('hidden');
                }
            }
        } catch (error) {
            if (githubAuthError) {
                githubAuthError.textContent = `Network error: ${error.message}`;
                githubAuthError.classList.remove('hidden');
            }
        }
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', sendOtpToUser);
    }

    if (githubEmailInput) {
        githubEmailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendOtpToUser();
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', verifyUserOtp);
    }

    if (githubOtpInput) {
        githubOtpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyUserOtp();
        });
    }

    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sendOtpToUser();
        });
    }

    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (githubOtpStep) githubOtpStep.classList.add('hidden');
            if (githubEmailStep) githubEmailStep.classList.remove('hidden');
            if (githubEmailInput) githubEmailInput.focus();
        });
    }

    if (toggleTokenInputLink && manualTokenDiv) {
        toggleTokenInputLink.addEventListener('click', (e) => {
            e.preventDefault();
            manualTokenDiv.classList.toggle('hidden');
        });
    }

    if (connectGithubTokenBtn && githubTokenInput) {
        connectGithubTokenBtn.addEventListener('click', () => {
            const token = githubTokenInput.value.trim();
            verifyAndConnectGithub(token);
        });

        githubTokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const token = githubTokenInput.value.trim();
                verifyAndConnectGithub(token);
            }
        });
    }

    if (disconnectGithubBtn) {
        disconnectGithubBtn.addEventListener('click', async () => {
            await chrome.storage.local.remove(['githubConnected', 'githubToken', 'githubUser']);
            if (githubTokenInput) githubTokenInput.value = '';
            showGithubGateway('Disconnected from GitHub. Connect again to enter extension.');
        });
    }

    // Check GitHub login status on load
    chrome.storage.local.get([
        'githubConnected', 'githubUser', 'useCustomAPI', 'aiProvider', 'customEndpoint', 'customAPIKey', 'customModelName'
    ], function (result) {
        if (result.githubConnected && result.githubUser) {
            showMainContent(result.githubUser);
        } else {
            showGithubGateway();
        }

        initFreeUser();
        loadAPIConfiguration();
        initializeOpacityLevel();
        updateShortcutsForPlatform();
    });

    // Initialize toast opacity level from storage
    function initializeOpacityLevel() {
        chrome.storage.local.get(['toastOpacityLevel'], (result) => {
            if (result.toastOpacityLevel) {
                opacityLevelDisplay.textContent = capitalizeFirstLetter(result.toastOpacityLevel);
            } else {
                opacityLevelDisplay.textContent = 'High'; // Default value
            }
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Handle toast opacity toggle button click
    if (toastOpacityToggle) {
        toastOpacityToggle.addEventListener('click', function() {
            chrome.runtime.sendMessage({ action: 'toggleToastOpacity' }, (response) => {
                if (response && response.success) {
                    // Update the displayed level
                    opacityLevelDisplay.textContent = capitalizeFirstLetter(response.level);
                    
                    // Show a temporary success message
                    showError(`Toast opacity set to: ${capitalizeFirstLetter(response.level)}`, 2000);
                }
            });
        });
    }

    // Initialize opacity level on load
    initializeOpacityLevel();
    
    // Load saved API configuration (for Free tab - always accessible)
    function loadAPIConfiguration() {
        chrome.storage.local.get([
            'useCustomAPI',
            'aiProvider',
            'customEndpoint',
            'customAPIKey',
            'customModelName'
        ], (result) => {
            if (result.useCustomAPI) {
                useCustomAPIToggle.checked = true;
                customAPIForm.classList.remove('hidden');
            }
            if (result.aiProvider) {
                document.getElementById('aiProvider').value = result.aiProvider;
                // Show custom endpoint field only if provider is 'custom'
                if (result.aiProvider === 'custom') {
                    customEndpointDiv.classList.remove('hidden');
                } else {
                    // Explicitly hide custom endpoint field for other providers
                    customEndpointDiv.classList.add('hidden');
                }
            } else {
                // If no provider is saved, hide custom endpoint field by default
                customEndpointDiv.classList.add('hidden');
            }
            if (result.customEndpoint && customEndpointInput) {
                customEndpointInput.value = result.customEndpoint;
            }
            if (result.customAPIKey && apiKeyInput) {
                apiKeyInput.value = result.customAPIKey;
            }
            if (result.customModelName && modelNameInput) {
                modelNameInput.value = result.customModelName;
            }
        });
    }



    // Toggle custom API form visibility
    if (useCustomAPIToggle) {
        useCustomAPIToggle.addEventListener('change', async function() {
            if (this.checked) {
                customAPIForm.classList.remove('hidden');
                // Auto-save when toggle is enabled
                autoSaveAPIConfig();
            } else {
                customAPIForm.classList.add('hidden');
                // Explicitly remove custom API configuration when toggle is turned off
                await chrome.storage.local.remove(CUSTOM_API_STORAGE_KEYS);
                if (aiProviderSelect) {
                    aiProviderSelect.selectedIndex = 0;
                }
                if (customEndpointDiv) {
                    customEndpointDiv.classList.add('hidden');
                }
                if (apiKeyInput) {
                    apiKeyInput.value = '';
                }
                if (customEndpointInput) {
                    customEndpointInput.value = '';
                }
                if (modelNameInput) {
                    modelNameInput.value = '';
                }
                
                // Clear chat history when disabling custom API
                clearChatHistoryOnProviderChange();
                
                showError('Custom API disabled. Using default proxy.', 2000);
            }
        });
    }

    // Show/hide custom endpoint field based on provider selection
    if (aiProviderSelect) {
        aiProviderSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customEndpointDiv.classList.remove('hidden');
            } else {
                customEndpointDiv.classList.add('hidden');
            }
            
            // Clear chat history when switching providers
            clearChatHistoryOnProviderChange();
            
            // Auto-save when provider changes
            autoSaveAPIConfig();
        });
    }

    // Add auto-save listeners to API configuration inputs
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', autoSaveAPIConfig);
    }
    if (customEndpointInput) {
        customEndpointInput.addEventListener('input', autoSaveAPIConfig);
    }
    if (modelNameInput) {
        modelNameInput.addEventListener('input', autoSaveAPIConfig);
    }

    // Test API configuration
    if (testAPIConfigButton) {
        testAPIConfigButton.addEventListener('click', async function() {
            const apiKey = document.getElementById('apiKey').value.trim();
            const aiProvider = document.getElementById('aiProvider').value;
            const customEndpoint = document.getElementById('customEndpoint').value.trim();
            const modelName = document.getElementById('modelName').value.trim();

            if (!apiKey) {
                showError('Please enter an API key first', 3000);
                return;
            }

            // Show loading state
            testAPIConfigButton.textContent = 'Testing...';
            testAPIConfigButton.disabled = true;

            try {
                // Send test message to background script
                chrome.runtime.sendMessage({
                    action: 'testCustomAPI',
                    config: {
                        aiProvider: aiProvider,
                        customEndpoint: customEndpoint,
                        apiKey: apiKey,
                        modelName: modelName
                    }
                }, (response) => {
                    testAPIConfigButton.textContent = 'Test Connection';
                    testAPIConfigButton.disabled = false;

                    if (response && response.success) {
                        showError('✓ API connection successful!', 3000);
                    } else {
                        showError('✗ API connection failed: ' + (response?.error || 'Unknown error'), 5000);
                    }
                });
            } catch (error) {
                testAPIConfigButton.textContent = 'Test Connection';
                testAPIConfigButton.disabled = false;
                showError('Error testing API: ' + error.message, 5000);
            }
        });
    }

    // Uninstall button event listener
    if (uninstallButton) {
        uninstallButton.addEventListener('click', async () => {
            try {
                // Clear all storage
                await chrome.storage.local.clear();
                
                // Uninstall the extension
                chrome.management.uninstallSelf();
            } catch (error) {
                console.error('Error during uninstall:', error);
                errorElement.textContent = 'Error uninstalling extension';
            }
        });
    }

});

