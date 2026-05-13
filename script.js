const meals = [
  "Spaghetti",
  "Curry",
  "Pierogi",
  "Pizza",
  "Risotto"
];

document.getElementById("randomBtn").addEventListener("click", () => {

  const randomMeal =
    meals[Math.floor(Math.random() * meals.length)];

  document.getElementById("mealContainer").innerHTML = `
    <h2>${randomMeal}</h2>
  `;
});
