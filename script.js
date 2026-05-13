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

  container.innerHTML = "";

  meals.forEach(meal => {

    const div = document.createElement("div");

    div.classList.add("meal-card");

    div.addEventListener("click", () => {

  saveLastMeal(meal.name);

  document
    .querySelectorAll(".meal-card")
    .forEach(card => {
      card.classList.remove("highlight");
    });

  div.classList.add("highlight");
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
      meals[Math.floor(Math.random() * meals.length)];

    showSuggestion(randomMeal);
});

    
});

loadMeals();

document
  .getElementById("easyBtn")
  .addEventListener("click", () => {

    const easyMeals = meals.filter(meal =>
      Number(meal.effort) <= 2
    );

    if (easyMeals.length === 0) {
      
      return;
    }

    const randomMeal =
      easyMeals[
        Math.floor(Math.random() * easyMeals.length)
      ];
    saveLastMeal(randomMeal.name);
});

function saveLastMeal(mealName) {

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
          onclick="acceptMeal('${meal.name}')"
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

    </div>
  `;
}

function acceptMeal(mealName) {

  saveLastMeal(mealName);

  displayMeals(meals);

  displayLastMeal();

  document
    .getElementById("suggestionBox")
    .innerHTML = "";
}
function generateAnotherMeal() {

  const randomMeal =
    meals[
      Math.floor(Math.random() * meals.length)
    ];

  showSuggestion(randomMeal);
}
displayLastMeal();
