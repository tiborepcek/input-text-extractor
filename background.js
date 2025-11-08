/**
 * Handles a download request from the popup script.
 * @param {string} text The text content to download.
 * @param {chrome.tabs.Tab} tab The tab where the extraction happened.
 */
async function downloadExtractedText(text, tab) {
  const url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  const pageTitle = tab.title.replace(/[^a-z0-9_.-]/gi, '_').slice(0, 50) || 'untitled';
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
  const filename = `extraction_${pageTitle}_${timestamp}.txt`;
  const extensionName = chrome.runtime.getManifest().name;

  try {
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  } catch (e) {
    console.error(`Error during download process: ${e.message}`);
    // Don't show an error if the user intentionally cancelled the download.
    if (e.message.toLowerCase().includes('user cancelled')) {
      return;
    }
    // Notify the user that the download failed.
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `${extensionName}: Download Error`,
      message: `The file could not be downloaded. Please try again.`
    });
  }
}

// Create the context menu item on installation.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extract-text",
    title: "Extract Input Text",
    contexts: ["page"]
  });
});

// Listen for clicks from the context menu.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extract-text") {
    // When the context menu is clicked, we can't open a popup,
    // so we inject the script directly and handle the result here.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    }, (injectionResults) => {
      const result = (injectionResults && injectionResults[0]) ? injectionResults[0].result : null;
      if (result && result.status === 'success') {
        downloadExtractedText(result.data, tab);
      }
    });
  }
});

// Listen for messages from the popup script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'download') {
    downloadExtractedText(message.data, message.tab);
  }
});