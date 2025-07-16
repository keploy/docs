/* eslint-disable */
window.addEventListener("DOMContentLoaded", function () {
  function createButton(label, ariaLabel, icon, className) {
    const btn = document.createElement("button");
    btn.classList.add("btnIcon", className);
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", ariaLabel);
    btn.innerHTML = `
      <div class="btnIcon__body">
        ${icon}
        <strong class="btnIcon__label">${label}</strong>
      </div>
    `;
    return btn;
  }

  function addButtons(codeBlockSelector, btnTemplate) {
    document.querySelectorAll(codeBlockSelector).forEach((codeBlock) => {
      // Ensure we don't duplicate buttons
      if (!codeBlock.parentNode.querySelector(".btnClipboard")) {
        const btn = btnTemplate.cloneNode(true);
        codeBlock.parentNode.appendChild(btn);
      }
    });
  }

  const copyIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"/>
  </svg>`;

  const copyButton = createButton(
    "Copy",
    "Copy code to clipboard",
    copyIcon,
    "btnClipboard"
  );

  addButtons(".hljs", copyButton);

  const clipboard = new ClipboardJS(".btnClipboard", {
    text: (trigger) => {
      const codeBlock = trigger.parentNode.querySelector("code");
      return codeBlock ? codeBlock.innerText : "";
    }
  });

  // Track timeouts per button
  const buttonTimeouts = new WeakMap();

  clipboard.on("success", (event) => {
    event.clearSelection();
    const button = event.trigger;
    const label = button.querySelector(".btnIcon__label");
    
    // Clear existing timeout if any
    if (buttonTimeouts.has(button)) {
      clearTimeout(buttonTimeouts.get(button));
    }
    
    label.textContent = "Copied!";
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      label.textContent = "Copy";
      buttonTimeouts.delete(button);
    }, 2000);
    
    buttonTimeouts.set(button, timeoutId);
  });

  clipboard.on("error", (event) => {
    const label = event.trigger.querySelector(".btnIcon__label");
    label.textContent = "Failed";
    setTimeout(() => {
      label.textContent = "Copy";
    }, 2000);
  });
});
