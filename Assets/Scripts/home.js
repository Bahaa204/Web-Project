$(document).ready(function () {
    $.getJSON("./Assets/Scripts/Data.json", function (data) {
        let randomRecipes = data.sort(() => 0.5 - Math.random()).slice(0, 4);

        $(".recipe-card").each(function (index) {
            let recipe = randomRecipes[index];
            $(this).find("h3").text(recipe.name);
            $(this).find("p").text(`Meal Type: ${recipe.mealType.join(", ")} | Difficulty: ${recipe.difficulty}`);
        });
    });
});