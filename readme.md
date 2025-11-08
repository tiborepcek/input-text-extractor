# Input Text Extractor

A simple browser extension to extract text content from all input fields, text areas, and content-editable elements on a webpage and download it as a `.txt` file.

## Features

*   **One-Click Extraction**: Gathers text from all `<input>`, `<textarea>`, and content-editable elements on the current page.
*   **Two Ways to Use**: Access the functionality through the extension popup or a convenient right-click context menu.
*   **Smart Naming**: Automatically generates a descriptive filename for the downloaded text file, including the page title and a timestamp (e.g., `extraction_Page_Title_YYYY-MM-DD_HH-mm-ss.txt`).
*   **User-Friendly**: Provides clear notifications for download errors (unless a download is intentionally canceled by the user).
*   **Privacy-Focused**: All processing is done locally in your browser. No data is collected or sent to any server.

## How to Use

There are two ways to extract text from a webpage:

### 1. Using the Extension Popup

1.  Navigate to the webpage from which you want to extract text.
2.  Click the **Input Text Extractor** icon in your browser's toolbar.
3.  A popup will appear, showing all the extracted text.
4.  Click the **"Download"** button to save the text to a file. A "Save As" dialog will open, allowing you to choose the location and confirm the filename.

### 2. Using the Context Menu

1.  Navigate to the webpage from which you want to extract text.
2.  Right-click anywhere on the page.
3.  Select **"Extract Input Text"** from the context menu.
4.  A "Save As" dialog will immediately open for you to save the extracted text.

## Installation

Currently, the extension is not on the official web store. You can load it into your browser manually for development or personal use.

### For Google Chrome or Microsoft Edge

1.  **Download the code**: Clone this repository or download it as a ZIP file and unzip it to a local folder.
2.  **Open Extensions Page**: Open your browser and navigate to `chrome://extensions` (for Chrome) or `edge://extensions` (for Edge).
3.  **Enable Developer Mode**: Turn on the "Developer mode" toggle, usually found in the top-right corner of the page.
4.  **Load the Extension**:
    *   Click the **"Load unpacked"** button.
    *   Select the folder where you unzipped the extension files.
5.  **Done!**: The "Input Text Extractor" icon should now appear in your browser's toolbar.

## Privacy

This extension respects your privacy. All text extraction and processing happen entirely on your computer. The extension does not collect, store, or transmit any of your data or browsing activity.