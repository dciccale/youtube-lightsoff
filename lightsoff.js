// To save a reference by tabId to the switch state for each tab
var states = {};

// Toggle data for the title and icon of the extension
var toggles = {
  on: {
    title: 'Turn Lights Off',
    icon: 'icon48.png'
  },

  off: {
    title: 'Turn Lights On',
    icon: 'icon48-off.png'
  }
};

// Only available for youtube at the moment
var isYoutube = function(url) {
  return /youtube\.com\/watch/.test(url);
};

// Updates the title and icon of the extension according the switch state
var changeIcon = function(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    var isLightOff = states[tab.id];
    var data;

    if (typeof isLightOff === 'undefined') {
      isLightOff = false;
    }

    data = toggles[isLightOff ? 'off' : 'on'];

    chrome.browserAction.setTitle({title: data.title});
    chrome.browserAction.setIcon({path: data.icon});
  });
};

// Set the correct icon and title for the current tab
chrome.tabs.onActivated.addListener(function(activeInfo) {
  changeIcon(activeInfo.tabId);
});

// Turn lights back on if the page is refreshed or changed
chrome.tabs.onUpdated.addListener(function(tabId) {
  if (typeof states[tabId] !== 'undefined' && states[tabId]) {
    states[tabId] = false;
    changeIcon(tabId);
  }
});

// Remove reference of state for removed tabs
chrome.tabs.onRemoved.addListener(function(tabId) {
  if (states[tabId]) {
    delete states[tabId];
  }
});

// Toggle lights on/off when clicked
chrome.browserAction.onClicked.addListener(function(tab) {

  if (isYoutube(tab.url)) {
    chrome.tabs.executeScript({
      code: 'window.scrollTo(0, 0);' +
            'document.body.classList.toggle("lightsoff");'
    });

    // save state for the current tab
    states[tab.id] = !states[tab.id];

    // Update title and icon
    changeIcon(tab.id);
  }
});
