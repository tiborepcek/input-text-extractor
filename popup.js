/**
 * This script runs when the popup is opened. It injects the content script
 * and displays the result to the user.
 */
async function main() {
  const messageDiv = document.getElementById('message');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Guard against trying to run on protected pages.
  if (!tab || !tab.id || tab.url.startsWith('chrome://') || tab.url.startsWith('https://chrome.google.com')) {
    messageDiv.textContent = 'Cannot run on this page.';
    return;
  }

  // 1. Inject the content script to extract text.
  let injectionResults;
  try {
    injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  } catch (e) {
    console.error(`Script injection failed: ${e.message}`);
    messageDiv.textContent = 'Cannot run on this page.';
    return;
  }

  // 2. Process the result from the content script.
  const injectionResult = (Array.isArray(injectionResults) && injectionResults[0]) ? injectionResults[0].result : null;
  const result = injectionResult || { status: 'error_no_result', data: null };

  switch (result.status) {
    case 'success':
      // If successful, show a message and trigger the download.
      // The popup will close automatically when the download starts.
      messageDiv.textContent = 'Downloading extracted text...';
      // Send a message to the background script to handle the download.
      chrome.runtime.sendMessage({
        action: 'download',
        data: result.data,
        tab: tab
      });
      break;
    case 'empty_fields':
      messageDiv.textContent = 'Found input fields, but they are all empty.';
      break;
    case 'no_fields':
      messageDiv.textContent = 'No supported input fields were found on this page.';
      break;
    case 'error_no_result':
    default:
      messageDiv.textContent = 'An unexpected error occurred.';
      break;
  }
}

// Run the main function when the popup's content has loaded.
document.addEventListener('DOMContentLoaded', main);