// TODO:
// - ratings
// - recent history in Sheets
// - avoid disliked foods
// - weighted recommendations
// - Telegram reminders
// - chores system
// - NFC integration


const API_URL = "https://script.google.com/macros/s/AKfycbyLy0j_KoMuYpwAbksd5V9GEiUcCT8KBKcY13wWNDt7SSiprcDaIuVD-EJw2nKpnuaCqA/exec";

let meals = [];

async function loadMeals() {

  const response = await fetch(API_URL);

  meals = await response.json();

  displayMeals(meals);
}

function displayMeals(meals) {

  const container =
    document.getElementById("mealContainer");

  const selectedMeal =
    localStorage.getItem("lastMeal");

  container.innerHTML = "";

  meals.forEach(meal => {

    const div = document.createElement("div");

    div.classList.add("meal-card");

    if (meal.name === selectedMeal) {
      div.classList.add("highlight");
    }

    div.addEventListener("click", () => {

      saveLastMeal(meal.name);

      displayMeals(meals);
    });

    div.innerHTML = `
      <div class="meal-title">
        ${meal.name}
      </div>

      <p>⏱ Cook time: ${meal.cook_time || "?"} min</p>

      <div class="tags">

        <div class="tag">
          💪 Effort: ${meal.effort || "?"}
        </div>

        <div class="tag">
          🧼 Cleanup: ${meal.cleanup || "?"}
        </div>

      </div>
    `;

    container.appendChild(div);
  });
}

document
  .getElementById("randomBtn")
  .addEventListener("click", () => {

    const randomMeal =
      meals[
        Math.floor(Math.random() * meals.length)
      ];

    showSuggestion(randomMeal);
});

document
  .getElementById("easyBtn")
  .addEventListener("click", () => {

    const availableMeals =
      getAvailableMeals();
    
    const easyMeals =
      availableMeals.filter(meal =>
        Number(meal.effort) <= 2
      );

    if (easyMeals.length === 0) {
      return;
    }

    const randomMeal =
      easyMeals[
        Math.floor(Math.random() * easyMeals.length)
      ];

    showSuggestion(randomMeal);
});

function saveLastMeal(mealName) {

  let recentMeals =
  JSON.parse(
    localStorage.getItem("recentMeals")
  ) || [];

recentMeals.unshift(mealName);

recentMeals = recentMeals.slice(0, 3);

localStorage.setItem(
  "recentMeals",
  JSON.stringify(recentMeals)
);

localStorage.setItem(
  "lastMeal",
  mealName
);

  displayLastMeal(mealName);
}

function displayLastMeal(mealName = null) {

  const lastMeal =
    mealName ||
    localStorage.getItem("lastMeal");

  const div =
    document.getElementById("lastMeal");

  if (lastMeal) {

    div.innerHTML = `
      <div class="meal-card highlight">
        ⭐ Last chosen meal:
        <strong>${lastMeal}</strong>
      </div>
    `;
  }
}

function getAvailableMeals() {

  const recentMeals =
    JSON.parse(
      localStorage.getItem("recentMeals")
    ) || [];

  const filteredMeals =
    meals.filter(meal =>
      !recentMeals.includes(meal.name)
    );

  if (filteredMeals.length === 0) {
    return meals;
  }

  return filteredMeals;
}

function showSuggestion(meal) {

  const box =
    document.getElementById("suggestionBox");

  box.innerHTML = `
    <div class="meal-card highlight">

      <h2>🎲 Suggested Meal</h2>

      <div class="meal-title">
        ${meal.name}
      </div>

      <p>
        ⏱ ${meal.cook_time} min
      </p>

      <div class="suggestion-buttons">

        <button
          class="accept-btn"
          onclick='acceptMeal("${meal.name}")'
        >
          ✅ Accept
        </button>

        <button
          class="reject-btn"
          onclick="generateAnotherMeal()"
        >
          🔄 Another
        </button>

      </div>

      <div style="margin-top: 15px;">

        <select id="daySelect">

          <option value="Today">
            Today
          </option>

          <option value="Tomorrow">
            Tomorrow
          </option>

          <option value="Monday">
            Monday
          </option>

          <option value="Tuesday">
            Tuesday
          </option>

          <option value="Wednesday">
            Wednesday
          </option>

          <option value="Thursday">
            Thursday
          </option>

          <option value="Friday">
            Friday
          </option>

          <option value="Saturday">
            Saturday
          </option>

          <option value="Sunday">
            Sunday
          </option>

        </select>

        <button
          onclick='planMeal("${meal.name}")'
        >
          📅 Add to plan
        </button>

      </div>

    </div>
  `;
}

function acceptMeal(mealName) {

  saveLastMeal(mealName);

  displayMeals(meals);

  document
    .getElementById("suggestionBox")
    .innerHTML = "";
}

function generateAnotherMeal() {

  const availableMeals =
  getAvailableMeals();

  const randomMeal =
    availableMeals[
      Math.floor(Math.random() * availableMeals.length)
    ];

  showSuggestion(randomMeal);
}

function planMeal(mealName) {

  const plan =
    JSON.parse(
      localStorage.getItem("mealPlan")
    ) || [];

  const selectedDay =
    document.getElementById("daySelect").value;

  plan.unshift({
    meal: mealName,
    day: selectedDay,
    cooked: false
  });

  localStorage.setItem(
    "mealPlan",
    JSON.stringify(plan)
  );

  displayMealPlan();
}

function displayMealPlan() {

  const plan =
    JSON.parse(
      localStorage.getItem("mealPlan")
    ) || [];

  const container =
    document.getElementById("mealPlan");

  container.innerHTML = "";

  plan.forEach((item, index) => {

    const div =
      document.createElement("div");

    div.classList.add("meal-card");

    div.innerHTML = `
      <div class="meal-title">
        ${item.meal}
      </div>

      <p>
        📅 ${item.day}
      </p>

      <p>
        ${item.cooked ? "✅ Cooked" : "🕒 Planned"}
      </p>

      <button onclick="toggleCooked(${index})">
        ${item.cooked ? "Undo" : "Mark cooked"}
      </button>
    `;

    container.appendChild(div);
  });
}

function toggleCooked(index) {

  const plan =
    JSON.parse(
      localStorage.getItem("mealPlan")
    ) || [];

  plan[index].cooked =
    !plan[index].cooked;

  localStorage.setItem(
    "mealPlan",
    JSON.stringify(plan)
  );

  displayMealPlan();
}


displayLastMeal();
displayMealPlan();
loadMeals();