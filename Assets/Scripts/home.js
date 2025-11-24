let featuredRecipes = [
    {
      name: "Russian Borscht",
      description:
        "A hearty and comforting beet and cabbage soup, often served with a dollop of sour cream.",
    },
    {
      name: "Mango Avocado Salsa",
      description:
        "A refreshing and vibrant salsa combining diced mango, avocado, red onion, and cilantro with a hint of lime.",
    },
    {
      name: "Chicken Biryani",
      description:
        "A fragrant and flavorful South Asian rice dish featuring marinated chicken layered with aromatic basmati rice and spices.",
    },
    {
      name: "Korean Bibimbap",
      description:
        "A vibrant and delicious rice bowl topped with an assortment of sautéed vegetables, marinated beef, and a fried egg, usually mixed with gochujang.",
    },
  ];

    let cards = document.querySelectorAll(".recipe-card");
    cards.forEach((card, index) => {
      card.querySelector("h3").innerText = featuredRecipes[index].name
      card.querySelector("p").innerText = featuredRecipes[index].description
    });