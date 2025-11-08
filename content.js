/**
 * Finds all relevant input, textarea, and contenteditable elements and extracts their text content.
 * @returns {{status: string, data: string|null}} An object with the extraction status and data.
 */
function extractTextFromInputs() {
  // A set of input types that we want to ignore.
  const excludedInputTypes = new Set([
    'button', 'checkbox', 'color', 'date', 'datetime-local', 'file',
    'hidden', 'image', 'month', 'number', 'radio', 'range', 'reset',
    'submit', 'time', 'week'
  ]);

  // Select all inputs, textareas, and contenteditable elements.
  const inputs = document.querySelectorAll(
    'input, textarea, [contenteditable="true"]'
  );

  const extractedParts = [];
  let relevantFieldCount = 0;

  inputs.forEach((input) => {
    // For <input> elements, skip the ones with excluded types.
    if (input.tagName === 'INPUT' && excludedInputTypes.has(input.type)) {
      return;
    }

    // Skip fields that are disabled or not visible
    const style = window.getComputedStyle(input);
    if (input.disabled || style.display === 'none' || style.visibility === 'hidden') {
      return;
    }

    // Find a good label for the field.
    let labelText = 'Untitled Field';
    // 1. Try to find a <label> with a `for` attribute matching the input's id.
    if (input.id) {
      const labelElement = document.querySelector(`label[for="${input.id}"]`);
      if (labelElement) labelText = labelElement.innerText.trim().replace(':', '');
    }
    // 2. If no label is found, check if the input is wrapped by a <label>.
    if (labelText === 'Untitled Field') {
      const parentLabel = input.closest('label');
      if (parentLabel) labelText = parentLabel.innerText.trim().replace(':', '');
    }
    // 3. As a fallback, use other attributes.
    if (labelText === 'Untitled Field') {
      labelText = input.name || input.ariaLabel || input.placeholder || '';
    }

    // If we couldn't find a meaningful label, skip this field entirely.
    if (!labelText) {
      return;
    }

    relevantFieldCount++;
    let value;
    if (input.isContentEditable) {
      value = input.innerText.trim();
    } else {
      value = input.value.trim();
    }

    if (value) { // Only include fields that have content
      extractedParts.push(`[${labelText}]:\n${value}\n\n`);
    }
  });

  // Case 1: We found text to extract.
  if (extractedParts.length > 0) {
    let header = `Extracted from: ${window.location.href}\n`;
    header += `Date: ${new Date().toLocaleString()}\n\n`;
    header += "========================================\n\n";
    return { status: 'success', data: header + extractedParts.join('') };
  }

  // Case 2: We found relevant fields, but they were all empty.
  if (relevantFieldCount > 0) {
    return { status: 'empty_fields', data: null };
  }

  // Case 3: No relevant fields were found on the page at all.
  return { status: 'no_fields', data: null };
}

// The last expression in the script is its return value
extractTextFromInputs();