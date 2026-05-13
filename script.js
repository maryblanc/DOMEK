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

    alert(`Today's meal: ${randomMeal.name}`);
});

loadMeals();

document
  .getElementById("easyBtn")
  .addEventListener("click", () => {

    const easyMeals = meals.filter(meal =>
      Number(meal.effort) <= 2
    );

    if (easyMeals.length === 0) {
      alert("No easy meals 😭");
      return;
    }

    const randomMeal =
      easyMeals[
        Math.floor(Math.random() * easyMeals.length)
      ];

    alert(`😴 Easy meal: ${randomMeal.name}`);
});
