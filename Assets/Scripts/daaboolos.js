// Getting all the elements needed
let Gifpopup = document.getElementById("gifPopup");
let ChatContainer = document.querySelector(".chat-container");
let ChatWindow = document.querySelector(".chat-messages");
let sendBtn = document.getElementById("sendBtn");
let input = document.getElementById("userInput");

ChatContainer.style.height = "500px";

function RenderGIF() {
  console.log("waiting on daaboolos");
  Gifpopup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function HideGIF() {
  Gifpopup.classList.remove("active");
  document.body.style.overflow = "";
}

function ExpandWindow(forced = false) {
  let containerHeight = parseFloat(ChatContainer.style.height);
  // console.log("Initial Container Height:", containerHeight);
  let messagesHeight = ChatWindow.scrollHeight;
  // console.log("Chat Window Height:", messagesHeight);
  if (messagesHeight > containerHeight || forced) {
    ChatContainer.style.height = `${ChatWindow.scrollHeight + 150}px`;
  }
}

function AddMessage(text, isBot = false) {
  let messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    `${isBot ? "bot-message" : "user-message"}`
  );
  let messageHTML = `
  <div class="message-content">
  <p>${text}</p>
  </div>
  `;
  messageElement.innerHTML = messageHTML;
  ChatWindow.appendChild(messageElement);
  ExpandWindow();
}

function handleInput() {
  let userinput = input.value;
  if (userinput !== "") {
    AddMessage(userinput);
    input.value = "";
    askGemini(userinput);
  } else {
    alert("Please enter some text");
  }
}

async function askGemini(input) {
  let response = await fetch("/Assets/Scripts/Data.json");
  let data = await response.json();
  let api_key = "AIzaSyAesnHKWHC06joY6L9TwMCmiiLJnYUTF04";
  let prompt = `You are a Personal Chef for a cooking website known as 'CookLab'. The data for the recipe book is ${JSON.stringify(
    data
  )}. The user has asked '${input}'. If the recipe is not found in the given names, you may tell the user that it is not found within the recipe book and to request it so it can be added later.Do not make the text bold, italic, or underline and dont include the ids of recipes. if the user asked for something related to the website eg. where can i find the about us , contact, recipe book, or home page, refer him to that page via`;

  let daaboolos_promise = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  let interval = setInterval(RenderGIF, 100);

  let daaboolos_answer = await daaboolos_promise;
  let answer = await daaboolos_answer.json();
  answer = answer.candidates[0].content.parts[0].text.trim();
  clearInterval(interval);
  HideGIF();
  answer = answer.replaceAll("\n", "<br>");
  AddMessage(answer, true);
  // console.log(answer);
}

sendBtn.addEventListener("click", handleInput);

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleInput();
  }
});
