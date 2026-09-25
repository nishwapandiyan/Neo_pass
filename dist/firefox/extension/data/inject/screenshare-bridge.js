(function() {
  const id = 'np-ss-auth-port';
  let port = document.getElementById(id);
  if (!port) {
    port = document.createElement('span');
    port.id = id;
    port.style.display = 'none';
    document.documentElement.append(port);
  }

  const sync = () => chrome.storage.local.get({
    accessToken: '',
    loggedIn: false,
    isPro: false
  }, prefs => {
    port.dataset.npToken = prefs.accessToken || '';
    port.dataset.npLoggedIn = prefs.loggedIn ? 'true' : 'false';
    port.dataset.npIsPro = prefs.isPro ? 'true' : 'false';
  });

  sync();
  chrome.storage.onChanged.addListener(sync);

  const observer = new MutationObserver(() => {
    if (port.dataset.npOpenLogin === 'true') {
      port.dataset.npOpenLogin = 'false';
      try {
        chrome.runtime.sendMessage({ action: 'showLoginPrompt' });
      } catch (err) {}
    }
  });
  observer.observe(port, { attributes: true, attributeFilter: ['data-np-open-login'] });
})();
