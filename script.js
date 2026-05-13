// TODO:
// - ratings
// - recent history in Sheets
// - avoid disliked foods
// - weighted recommendations
// - Telegram reminders
// - chores system
// - NFC integration


const API_URL = "https://script.google.com/macros/s/AKfycbx8XOCVqS_i9gvyvEgqUd3V1CwGCOIPQS34R5C2euHmSKPKe1b1GfBaxHE3HSWU1mINEQ/exec";
let meals = [];

let mealPlan = [];

let selectedDay = null;

async function loadMeals() {

  const response = await fetch(API_URL);

  meals = await response.json();

  displayMeals(meals);
}

async function loadMealPlan() {

  try {

    const response =
      await fetch(
        API_URL + "?type=mealPlan"
      );

    mealPlan =
      await response.json();

    console.log("MealPlan:");
    console.log(mealPlan);

    displayWeeklyPlanner();

  } catch(error) {

    console.error(error);
  }
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


function openPlannerModal(day) {

  selectedDay = day;

  document
    .getElementById("plannerDayTitle")
    .innerText =
      `Meal for ${day}`;

  const mealSelect =
    document.getElementById("mealSelect");

  mealSelect.innerHTML = "";

  meals.forEach(meal => {

    const option =
      document.createElement("option");

    option.value = meal.name;
    option.textContent = meal.name;

    mealSelect.appendChild(option);

  });

  document
    .getElementById("plannerModal")
    .classList.remove("hidden");
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

  if (availableMeals.length === 0) {
  return;
}

  const randomMeal =
    availableMeals[
      Math.floor(Math.random() * availableMeals.length)
    ];

  showSuggestion(randomMeal);
}





const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function displayWeeklyPlanner() {

  const container =
    document.getElementById(
      "weeklyPlanner"
    );

  const plan = {};

  mealPlan.forEach(item => {

    plan[item.day.trim()] = {
      meal: item.meal,
      author: item.author,
      status: item.status
    };

  });

  container.innerHTML = "";

  DAYS.forEach(day => {

    const div =
      document.createElement("div");

    div.classList.add("day-card");

    const mealData =
      plan[day];

    div.innerHTML = `
      <div class="day-name">
        ${day}
      </div>

      ${
        mealData
          ? `
            <div class="day-meal">
              🍽 ${mealData.meal}
            </div>

            <div class="meal-author">
              👤 ${mealData.author}
            </div>

            <div class="meal-status">
              ${
                mealData.status === "cooked"
                  ? "✅ Cooked"
                  : "🕒 Planned"
              }
            </div>
          `
          : `
            <div class="empty-day">
              No meal planned
            </div>
          `
      }
    `;

    div.addEventListener("click", () => {

      openPlannerModal(day);

    });

    container.appendChild(div);

  });
}

async function saveMealPlan(
  day,
  meal,
  author = "Marysia"
) {

  await fetch(API_URL, {

    method: "POST",

     headers: {
    "Content-Type": "application/json"
  },


    body: JSON.stringify({
      day: day,
      meal: meal,
      author: author
    })
  });

  loadMealPlan();
}

document
  .getElementById("savePlanBtn")
  .addEventListener("click", () => {

    const meal =
      document.getElementById("mealSelect").value;

    const author =
      document.getElementById("authorSelect").value;

    saveMealPlan(
      selectedDay,
      meal,
      author
    );

    document
      .getElementById("plannerModal")
      .classList.add("hidden");
});


window.addEventListener("DOMContentLoaded", () => {

  displayLastMeal();

  loadMealPlan();

  loadMeals();
});