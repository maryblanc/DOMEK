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

    div.innerHTML = `
      <h3>${meal.name}</h3>
      <p>Cook time: ${meal.cook_time} min</p>
      <p>Effort: ${meal.effort}</p>
      <hr>
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
