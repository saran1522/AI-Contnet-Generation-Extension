import { runConversation } from "./getGeminiResponse.js";
import { marked } from "marked";

let aiIcon, modal;
let conversationHistory = [];

function createAIIcon() {
  aiIcon = document.createElement("div");
  aiIcon.id = "ai-icon";
  aiIcon.innerHTML = "✨";
  aiIcon.style.display = "none";
}
function createModal() {
  modal = document.createElement("div");
  modal.id = "ai-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 class="modal-heading">Generate Content</h2>
      <div id="response-area"></div>
      <div class="query-input">
        <input type="text" id="command-input" placeholder="Enter your command">
        <button id="generate-btn">Generate</button>
      </div>
    </div>
  `;
  modal.style.display = "none";
  document.body.appendChild(modal);
}

function showAIIcon(inputField) {
  inputField.style.position = "relative";
  aiIcon.style.display = "block";
  inputField.appendChild(aiIcon);
}

function hideAIIcon() {
  aiIcon.style.display = "none";
}

function showModal() {
  modal.style.display = "flex";
}

function hideModal() {
  modal.style.display = "none";
}

document.addEventListener(
  "focusin",
  (e) => {
    if (
      e.target.tagName === "input" ||
      e.target.tagName === "textarea" ||
      e.target.getAttribute("contenteditable") === "true"
    ) {
      const replyInput = e.target;
      showAIIcon(replyInput);
    }
  },
  true
);

document.addEventListener(
  "focusout",
  (e) => {
    if (
      e.target.tagName === "input" ||
      e.target.tagName === "textarea" ||
      e.target.getAttribute("contenteditable") === "true"
    ) {
      hideAIIcon(e.target);
    }
  },
  true
);

document.addEventListener("click", (e) => {
  if (e.target === aiIcon) {
    // e.preventDefault();
    showModal();
  } else if (e.target === modal) {
    hideModal();
  }
});

createAIIcon();
createModal();

document.addEventListener("click", async (e) => {
  if (e.target.id === "generate-btn") {
    const responseArea = document.getElementById("response-area");
    // const generateBtn = document.getElementById("generate-btn");
    const resQuery = document.querySelector("#command-input");
    // const insertBtn = document.getElementById("insert-btn");

    if (resQuery.value !== "") {
      conversationHistory = await runConversation(resQuery.value);
      resQuery.value = "";
      responseArea.innerHTML = conversationHistory.map((r) => `<p>${r}</p>`);
      responseArea.innerHTML = conversationHistory
        .map((convo) => {
          const markedText = marked(convo.parts[0].text);
          return convo.role === "user"
            ? `<div class="res-query">${markedText}</div>`
            : `<div class="res">
                  <p id="res-text">${markedText}</p>
                  <span id="copy-btn">Copy</span>
                </div>`;
          // return convo.role === "user"
          //   ? `<p class = "res-query">${markedText}</p>`
          //   : `<p class = "res">${markedText}</p>`;
        })
        .join("");
      let copyBtns = document.querySelectorAll("#copy-btn");
      copyBtns.forEach((btn) => {
        addEventListener("click", (e) => {
          // const markedText = copyBtn.previousElementSibling;
          const textToCopy = btn.previousElementSibling;
          const text = textToCopy.innerText;
          // const textToCopy = markedText.textContent;
          navigator.clipboard
            .writeText(text)
            .then(() => {
              console.log("Text copied to clipboard");
              // Provide visual feedback
              const originalText = btn.textContent;
              btn.textContent = "Copied!";
              setTimeout(() => {
                btn.textContent = originalText;
              }, 2000);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        });
      });
    }
  }
});
