const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
let expression = "";

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  const value = button.dataset.value;
  const action = button.dataset.action;

  button.addEventListener("click", () => handleInput(value, action));
});

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  const key = event.key;
  const normalizedKey =
    key === "Enter"
      ? "="
      : key === "Backspace"
      ? "DEL"
      : key === "Escape"
      ? "C"
      : key;

  document.querySelectorAll("button").forEach((button) => {
    if (
      button.textContent === normalizedKey ||
      button.dataset.value === key ||
      (key === "Enter" && button.dataset.action === "equals") ||
      (key === "Backspace" && button.dataset.action === "delete") ||
      (key === "Escape" && button.dataset.action === "clear")
    ) {
      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 100);
    }
  });

  if (!isNaN(key) || "+-*/.()%".includes(key)) {
    expression += key;
    updateDisplay();
  } else if (key === "Enter") {
    evaluateExpression();
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (key === "Escape") {
    expression = "";
    updateDisplay();
  }
});

function handleInput(value, action) {
  if (action === "clear") {
    expression = "";
  } else if (action === "delete") {
    expression = expression.slice(0, -1);
  } else if (action === "equals") {
    evaluateExpression();
    return;
  } else if (value) {
    expression += value;
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = expression || "0";
}

function evaluateExpression() {
  try {
    const prepared = expression.replace(/(\d+)%/g, (_, num) => num / 100);
    const result = eval(prepared);
    addToHistory(expression + " = " + result);
    expression = result.toString();
  } catch {
    expression = "";
    display.textContent = "Error";
    return;
  }
  updateDisplay();
}

function addToHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyList.prepend(li);

  // Save to localStorage
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(entry);
  localStorage.setItem("calcHistory", JSON.stringify(history.slice(0, 20))); // Limit to 20 entries
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
  });
}
loadHistory();

// 🗑️ Clear History
document.getElementById("clearHistory").addEventListener("click", () => {
  historyList.innerHTML = "";
  localStorage.removeItem("calcHistory");
});

// 🌙☀️ Toggle theme
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
