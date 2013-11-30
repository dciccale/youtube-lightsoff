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

// Toggles the light switch and updates title and icon
var toggleSwitch = function (tabId) {
  // Save switch state for the current tab
  states[tabId] = !states[tabId];

  // Update title and icon
  changeIcon(tabId);
};

// Updates the title and icon of the extension according the switch state
var changeIcon = function(tabId) {
  var isLightOff = states[tabId];
  var data;

  if (typeof isLightOff === 'undefined') {
    isLightOff = false;
  }

  data = toggles[isLightOff ? 'off' : 'on'];

  chrome.browserAction.setTitle({title: data.title});
  chrome.browserAction.setIcon({path: data.icon});
};

// Set the correct icon and title for the current tab
chrome.tabs.onActivated.addListener(function(activeInfo) {
  changeIcon(activeInfo.tabId);
});

// Turn lights back on if the page is refreshed or changed only if it was activated
chrome.tabs.onUpdated.addListener(function(tabId) {
  if (states[tabId] === true) {
    toggleSwitch(tabId);
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

  // Only available for youtube at the moment
  if (/youtube\.com\/watch/.test(tab.url)) {
    chrome.tabs.executeScript({
      code: 'window.scrollTo(0, 0);' +
            'document.body.classList.toggle("lightsoff");'
    });

    toggleSwitch(tab.id);
  }
});
