// Getting all the elements needed
let Gifpopup = document.getElementById("gifPopup");
let ChatContainer = document.querySelector(".chat-container");
let ChatWindow = document.querySelector(".chat-messages");
let sendBtn = document.getElementById("sendBtn");
let input = document.getElementById("userInput");
let messagesHistory = JSON.parse(sessionStorage.getItem("messages")) || [];

ChatContainer.style.height = "500px";
window.onload = LoadMessages;

function LoadMessages() {
  messagesHistory.forEach((message) => {
    AddMessage(message.text, message.isbot, false);
  });
}

function RenderGIF() {
  console.log("waiting on daaboolos");
  Gifpopup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function HideGIF() {
  Gifpopup.classList.remove("active");
  document.body.style.overflow = "";
}

function ExpandWindow() {
  let containerHeight = parseFloat(ChatContainer.style.height);
  // console.log("Initial Container Height:", containerHeight);
  let messagesHeight = ChatWindow.scrollHeight;
  // console.log("Chat Window Height:", messagesHeight);
  if (messagesHeight > containerHeight) {
    ChatContainer.style.height = `${ChatWindow.scrollHeight + 150}px`;
  }
}

function AddMessage(text, isBot = false, save = true) {
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
  if (save) {
    messagesHistory.push({ isbot: isBot, text: text });
    sessionStorage.setItem("messages", JSON.stringify(messagesHistory));
  }
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
    AddMessage("Please enter some text", true);
  }
}

async function askGemini(input) {
  // Loading the Recipe Book data
  let response = await fetch("/Assets/Scripts/Data.json");
  let data = await response.json();
  data = JSON.stringify(data);

  // API Key
  let api_key = "AIzaSyAesnHKWHC06joY6L9TwMCmiiLJnYUTF04";

  //Checking if the base prompt is already sent to once to avoid redundancy
  let IsAlreadySent = sessionStorage.getItem("BasePromptSent");
  console.log("IsAlreadySent: ", IsAlreadySent);
  let prompt = `You are a Personal Chef for a cooking website known as 'CookLab'. The data for the recipe book is ${data}. If the recipe is not found in the given data, you may tell the user that it is not found within the recipe book and to request it so it can be added later. if the user asked for something related to the website (about us page, contact page, recipe book page, request a recipe page, or home page) refer them to that page. Do not add the recipes ids.`;

  // Loading the Memory of Daaboolos
  let daaboolosHistory =
    JSON.parse(sessionStorage.getItem("daaboolosHistory")) || [];

  let contents = [];

  if (!IsAlreadySent) {
    contents.push({ role: "user", parts: [{ text: prompt }] });
    // sessionStorage.setItem("BasePromptSent", "true");
  }

  // Attaching the Previous History to the chat
  daaboolosHistory.forEach((item) => {
    contents.push({ role: item.role, parts: [{ text: item.text }] });
  });

  // Attaching 8the Current User Input to the chat
  contents.push({ role: "user", parts: [{ text: input }] });

  // Calling the GEMINI API
  let daaboolos_promise = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  // Rendering the GIF Popup While the answer is being generated
  let interval = setInterval(RenderGIF, 100);

  // Proper Response Handling

  let daaboolos_result;
  try {
    let response = await daaboolos_promise;

    // Checking if the response is not OK Status
    if (!response.ok) {
      clearInterval(interval);
      HideGIF();

      // If an error has occurred Display it along with its status code
      if (response.status === 429) {
        AddMessage(
          `Error Status ${response.status} : Rate Limit Exceeded, Please Try again in a couple of minutes`,
          true
        );
        return;
      }
      AddMessage(
        `Error Status ${response.status}: ${response.statusText}`,
        true
      );
      return;
    }

    daaboolos_result = await response.json();

    // Checking if the answer is complete or not
    if (!daaboolos_result.candidates || !daaboolos_result.candidates[0]) {
      clearInterval(interval);
      HideGIF();
      AddMessage(
        "Error: No Answer fromm Daaboolos. Try gain in a few minutes",
        true
      );
      return;
    }
  } catch (error) {
    clearInterval(interval);
    HideGIF();
    AddMessage(`Network Error: ${error.message}`, true);
  }

  // Getting the answer of the the result
  let daaboolos_answer;
  try {
    daaboolos_answer =
      daaboolos_result.candidates[0].content.parts[0].text.trim();
  } catch {
    console.log(daaboolos_result);
    clearInterval(interval);
    HideGIF();
    AddMessage("Error: Could not parse Daaboolos Response", true);
    return;
  }

  daaboolos_answer = daaboolos_answer.replaceAll("\n", "<br>");
  daaboolos_answer = daaboolos_answer.replaceAll("*", "");
  daaboolos_answer = daaboolos_answer.replaceAll("-", "");
  daaboolos_answer = daaboolos_answer.replaceAll("#", "");

  // Saving the chat into memory
  daaboolosHistory.push({ role: "user", text: input });
  daaboolosHistory.push({ role: "model", text: daaboolos_answer });

  sessionStorage.setItem("daaboolosHistory", JSON.stringify(daaboolosHistory));
  sessionStorage.setItem("BasePromptSent", "true");

  // Display the Answer
  clearInterval(interval);
  HideGIF();
  AddMessage(daaboolos_answer, true);
}

sendBtn.addEventListener("click", handleInput);

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleInput();
  }
});
