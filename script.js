const API_URL = https:"//script.google.com/macros/s/AKfycbw3iqfAISyny6x3z93j3-yQlLwLgsKw1Lyv2gJIfRB6TA1MFHrsawRD-71Kf1nVOmub1g/exec";

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
