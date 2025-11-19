
const ingredients = [
  "chicken", "beef", "rice", "garlic", "cheese", "tomato",
  "pasta", "chocolate", "lemon", "milk", "egg", "butter"
];

const suggestionInput = document.getElementById("suggestionInput");
const tagsBox = document.getElementById("ingredientTags");
const suggestionsBox = document.getElementById("suggestionsBox");
const bear = document.getElementById("bear");

let typingTimeout;

suggestionInput.addEventListener("input", () => {
  const text = suggestionInput.value.toLowerCase();
  const words = text.split(" ");

  // Reset tags
  tagsBox.innerHTML = "";

  // Generate ingredient tags
  words.forEach(w => {
    if (ingredients.includes(w)) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = w;
      tagsBox.appendChild(tag);
    }
  });

  

  // Auto suggestions
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "none";

  for (let key in ideas) {
    if (text.includes(key)) {
      const div = document.createElement("div");
      div.textContent = ideas[key];
      suggestionsBox.style.display = "block";

      div.onclick = () => {
        suggestionInput.value = ideas[key];
        suggestionsBox.style.display = "none";
      };

      suggestionsBox.appendChild(div);
    }
  }
});



// ===============================
// AI-LIKE SUGGESTIONS
// ===============================
const ideas = {
  chicken: "Lemon Herb Chicken Roast",
  pasta: "Creamy Garlic Pasta",
  chocolate: "Molten Lava Cake",
  rice: "Butter Garlic Rice"
};

// ===============================
// FLAVOR SLIDER
// ===============================
const flavorOutput = document.getElementById("flavorOutput");
const flavorSlider = document.getElementById("flavorSlider");
const flavors = ["Sweet 🍯", "Salty 🧂", "Sour 🍲", "Umami 🍪"];
const flavorCount = flavors.length;

flavorSlider.addEventListener("input", () => {
    const raw = parseFloat(flavorSlider.value); // 0 → 1
    // Snap slider to nearest flavor
    const step = 1 / (flavorCount - 1);         // e.g., 1/3 for 4 flavors
    const nearest = Math.round(raw / step);     // nearest flavor index
    flavorOutput.textContent = flavors[nearest];
});


// ===============================
// CURSOR FOLLOW — ONLY WHEN NOT TYPING
// ===============================
document.addEventListener("mousemove", (e) => {
  if (!bear.classList.contains("bear-typing")) {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    bear.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// ===============================
// SUCCESS POPUP + CONFETTI
// ===============================
document.getElementById("recipeForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const popup = document.getElementById("successPopup");
  popup.style.display = "block";

  // Confetti burst
  for (let i = 0; i < 20; i++) {
    const conf = document.createElement("div");
    conf.classList.add("confetti");
    conf.style.left = Math.random() * 100 + "%";
    conf.style.animationDuration = 1 + Math.random() * 1 + "s";
    conf.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 2000);
  }
});

// Inject confetti style
const style = document.createElement("style");
style.textContent = `
.confetti {
  position: fixed;
  top: 0;
  width: 8px;
  height: 8px;
  background: red;
  animation: fall linear;
}

@keyframes fall {
  to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
`;
document.body.appendChild(style);
