const finalBaseProducts = [
  {
    id: 1,
    name: "ميدالية سيارة تويوتا",
    shortDisc: "ميدالية ثلاثية الأبعاد بشعار تويوتا بتصميم متين وخفيفة الوزن.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 2,
    name: "ميدالية سيارة اودي",
    shortDisc: "ميدالية ثلاثية الأبعاد بشعار أودي بتفاصيل دقيقة ولمسة نهائية ناعمة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: [ "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/try.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 3,
    name: "ميدالية سيارة هوندا",
    shortDisc: "ميدالية شعار هوندا ثلاثية الأبعاد بتصميم كلاسيكي ومتين.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/Chicken_Alfredo.jpg", "assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg"]
  },
  {
    id: 4,
    name: "ميدالية سيارة هونداي",
    shortDisc: "ميدالية شعار هيونداي بطباعة ثلاثية الأبعاد بتشطيب قوي ومقاوم للخدش.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 5,
    name: "ميدالية سيارة مرسيدس",
    shortDisc: "ميدالية بشعار مرسيدس بتصميم أنيق وتفاصيل دقيقة مناسبة كهدايا فاخرة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 6,
    name: "ميدالية سيارة بي ام دابليو",
    shortDisc: "ميدالية شعار BMW بتفاصيل بارزة ولمسة نهائية لامعة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 7,
    name: "ميدالية سيارة فورد",
    shortDisc: "ميدالية شعار فورد بطباعة ثلاثية الأبعاد مقاومة للتآكل وخفيفة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/Sushi_Roll.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 8,
    name: "ميدالية سيارة ميتسوبيشي",
    shortDisc: "ميدالية شعار ميتسوبيشي بتصميم هندسي واضح وخامات مطبوعة عالية الجودة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 9,
    name: "ميدالية سيارة كيا",
    shortDisc: "ميدالية شعار كيا بتصميم عصري وخيارات ألوان متعددة للطباعة.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  },
  {
    id: 10,
    name: "ميدالية سيارة فوكسفاجن",
    shortDisc: "ميدالية شعار فولكس فاجن مطبوعة بدقة مع حواف ناعمة وقابلة للتخصيص.",
    categories: ["ميداليات السيارات", "ميدالية مطبوعة ثلاثي الأبعاد"],
    colors: [
      { name: "ازرق", code: "#0000FF" },
      { name: "ازرق فاتح", code: "#5DADEC" },
      { name: "كحلي", code: "#001F3F" },
      { name: "ابيض", code: "#FFFFFF" },
      { name: "اسود", code: "#000000" },
      { name: "زهري", code: "#FF69B4" },
      { name: "بنفسجي", code: "#800080" },
      { name: "بني", code: "#8B4513" },
      { name: "بيج", code: "#F5F5DC" },
      { name: "اخضر غامق", code: "#006400" },
      { name: "اخضر فيروزي", code: "#40E0D0" },
      { name: "اصفر", code: "#FFFF00" },
      { name: "دهبي", code: "#D4AF37" },
      { name: "رمادي", code: "#808080" },
      { name: "فضي", code: "#C0C0C0" },
      { name: "احمر غامق", code: "#8B0000" },
      { name: "احمر", code: "#FF0000" },
      { name: "برتقالي", code: "#FFA500" }
    ],
    price: 132,
    images: ["assets/imgs/try.jpg", "assets/imgs/Spaghetti_Bolognese.jpg", "assets/imgs/Chicken_Alfredo.jpg"]
  }
];


const baseProducts = [
    {
        id: 1,
        name: "Spaghetti Bolognese",
        shortDisc: "A classic Italian pasta dish made with a rich and flavorful meat sauce, perfect for family dinners.",
        ingredients: [
            "200g Spaghetti",
            "300g Minced beef",
            "1 Onion, chopped",
            "2 Garlic cloves, minced",
            "400g Tomatoes, crushed",
            "1 tsp Mixed herbs",
            "2 tbsp Olive oil",
            "Salt to taste",
            "Pepper to taste"
        ],
        preparation: "Begin by boiling a pot of water with a pinch of salt, and cook the spaghetti according to the package instructions until al dente. In a large pan, heat olive oil over medium heat and sauté the chopped onion until translucent. Add the minced garlic and cook for another minute, ensuring it doesn’t burn. Next, add the minced beef to the pan, breaking it apart with a spoon, and cook until browned. Stir in the crushed tomatoes, mixed herbs, salt, and pepper. Lower the heat and let the sauce simmer gently for about 15-20 minutes, stirring occasionally to prevent sticking. Drain the spaghetti and serve with the sauce poured on top, garnished with fresh basil or Parmesan cheese if desired.",
        categories: ["main-course", "italian"],
        image: "assets/imgs/Spaghetti_Bolognese.jpg"
},
{
        id: 2,
        name: "Chicken Alfredo",
        shortDisc: "A creamy and indulgent pasta dish featuring tender chicken slices and a rich Alfredo sauce.",
        ingredients: [
            "300g Chicken breast, sliced",
            "200g Pasta",
            "250ml Cream",
            "50g Parmesan cheese, grated",
            "2 Garlic cloves, minced",
            "2 tbsp Olive oil"
        ],
        preparation: "Start by boiling a large pot of salted water and cook the pasta according to package instructions. While the pasta cooks, heat olive oil in a large pan over medium-high heat. Add the sliced chicken breast and season with a pinch of salt and pepper. Cook the chicken until golden brown and fully cooked, then remove it from the pan and set aside. In the same pan, lower the heat and add the minced garlic, cooking until fragrant. Pour in the cream and bring to a gentle simmer, stirring continuously. Gradually add the grated Parmesan cheese and stir until fully melted and the sauce is smooth. Return the cooked chicken to the pan, mix well, and add the drained pasta. Toss everything together until evenly coated, then serve hot, garnished with extra Parmesan and parsley if desired.",
        categories: ["main-course", "italian"],
        image: "assets/imgs/Chicken_Alfredo.jpg"
},
{
        id: 3,
        name: "Beef Stroganoff",
        shortDisc: "A hearty Russian dish with tender beef strips cooked in a creamy and savory sauce.",
        ingredients: [
            "300g Beef strips",
            "1 Onion, chopped",
            "2 Garlic cloves, minced",
            "200g Mushrooms, sliced",
            "150ml Cream",
            "1 tsp Mustard",
            "100ml Broth"
        ],
        preparation: "Begin by seasoning the beef strips with salt and pepper. Heat a large skillet over medium-high heat and sear the beef strips until browned on all sides. Remove the beef from the pan and set aside. In the same skillet, reduce the heat to medium and add a bit more oil if necessary. Sauté the chopped onions until softened, then add the minced garlic and cook for an additional minute. Add the sliced mushrooms and cook until they release their moisture and begin to brown. Stir in the mustard and pour in the broth, scraping the bottom of the pan to deglaze. Allow the mixture to simmer for a few minutes before returning the beef to the skillet. Finally, lower the heat and stir in the cream, cooking until the sauce thickens slightly. Serve the Stroganoff over rice, mashed potatoes, or egg noodles for a complete meal.",
        categories: ["main-course", "russian"],
        image: "assets/imgs/Beef_Stroganoff.jpg"
},
{
        id: 4,
        name: "Caesar Salad",
        shortDisc: "A crisp and refreshing salad with romaine lettuce, crunchy croutons, and a creamy Caesar dressing.",
        ingredients: [
            "1 Romaine lettuce, chopped",
            "50ml Caesar dressing",
            "50g Croutons",
            "30g Parmesan cheese, grated"
        ],
        preparation: "Start by washing and drying the romaine lettuce thoroughly, then chop it into bite-sized pieces. Place the lettuce in a large bowl. Add the croutons for a delightful crunch and sprinkle the grated Parmesan cheese over the top. Drizzle the Caesar dressing evenly over the salad. Using salad tongs or clean hands, toss the ingredients gently to ensure everything is coated with the dressing. Serve immediately as a refreshing appetizer or alongside a main dish.",
        categories: ["Appetizer", "salad"],
        image: "assets/imgs/Caesar_Salad.jpg"
},
{
        id: 5,
        name: "Tacos",
        shortDisc: "Delicious Mexican tacos filled with seasoned meat, fresh vegetables, and melted cheese.",
        ingredients: [
            "4 Tortillas",
            "200g Ground beef",
            "50g Cheese, grated",
            "1 Lettuce, shredded",
            "50ml Salsa"
        ],
        preparation: "Begin by heating a non-stick skillet over medium heat. Add the ground beef and cook, breaking it apart with a wooden spoon, until browned and fully cooked. Drain any excess fat and season with taco spices or a blend of paprika, cumin, and chili powder. Warm the tortillas in a dry pan or microwave until soft and pliable. To assemble the tacos, start by spreading a spoonful of salsa onto each tortilla. Add a generous portion of the seasoned beef, followed by shredded lettuce and grated cheese. Fold the tortilla and serve immediately, adding extra toppings like sour cream, guacamole, or hot sauce as desired.",
        categories: ["main-course", "mexican"],
        image: "assets/imgs/Tacos.jpg"
},
{
        id: 6,
        name: "Margarita Pizza",
        shortDisc: "A simple yet flavorful Italian pizza with a crispy crust, tomato sauce, mozzarella, and fresh basil.",
        ingredients: [
            "1 Pizza dough",
            "100g Tomato sauce",
            "150g Mozzarella cheese",
            "Fresh basil leaves"
        ],
        preparation: "Preheat your oven to the highest temperature possible, typically around 250°C (482°F). Roll out the pizza dough on a floured surface to your desired thickness. Place the dough on a pizza stone or baking sheet. Spread the tomato sauce evenly across the dough, leaving a small border around the edges for the crust. Tear the mozzarella cheese into small pieces and scatter them evenly over the sauce. Add a few fresh basil leaves on top. Bake in the preheated oven for about 7-10 minutes, or until the crust is golden and the cheese is bubbly. Remove from the oven, slice, and serve hot.",
        categories: ["main-course", "italian"],
        image: "assets/imgs/Margarita_Pizza.jpg"
},
{
    id: 7,
    name: "Sushi Roll",
    shortDisc: "A traditional Japanese dish made with vinegared rice, fresh fish, and crisp vegetables rolled in seaweed.",
    ingredients: [
        "200g Sushi rice",
        "5 Sheets of Nori",
        "100g Fish, sliced",
        "50g Vegetables, julienned"
    ],
    preparation: "Begin by cooking the sushi rice according to package instructions. Once cooked, season the rice with sushi vinegar by gently folding it in while the rice is warm. Allow the rice to cool to room temperature. Place a sheet of nori, shiny side down, on a bamboo sushi mat. Spread a thin layer of rice evenly over the nori, leaving about 2 cm at the top edge free. Arrange slices of fish and julienned vegetables in a straight line near the bottom edge of the rice. Using the bamboo mat, carefully roll the nori from the bottom edge, pressing gently but firmly to create a tight roll. Seal the edge with a small dab of water. Slice the roll into even pieces using a sharp, wet knife. Serve with soy sauce, pickled ginger, and wasabi.",
    categories: ["Appetizer", "japanese"],
    image: "assets/imgs/Sushi_Roll.jpg"
},
{
    id: 8,
    name: "Tom Yum Soup",
    shortDisc: "A flavorful Thai soup that combines spicy, sour, and aromatic ingredients with tender shrimp.",
    ingredients: [
        "200g Shrimp",
        "1 Lime, juiced",
        "2 Red chilies, sliced",
        "1 Stalk of lemongrass, chopped",
        "500ml Broth"
    ],
    preparation: "Begin by preparing the broth in a medium-sized pot. Bring the broth to a boil and add the sliced lemongrass, chilies, and lime juice. Let the broth simmer for 5-7 minutes to allow the flavors to infuse. Add the shrimp to the pot and cook for 3-4 minutes, or until they turn pink and are fully cooked. Adjust the seasoning with salt or fish sauce if needed. Serve the soup hot, garnished with fresh cilantro and lime wedges for extra flavor.",
    categories: ["Appetizer", "thai", "soup"],
    image: "assets/imgs/Tom_Yum_Soup.jpg"
},
{
    "id": 9,
    "name": "Eggs and Bacon",
    "shortDisc": "A simple and hearty American breakfast featuring crispy bacon and sunny-side-up eggs.",
    "ingredients": [
        "4 Strips of bacon",
        "4 Eggs",
        "Salt and pepper, to taste",
        "1 tbsp Butter (optional)",
        "Toast or hash browns (optional, for serving)"
    ],
    "preparation": "Heat a skillet over medium heat and cook the bacon until crispy, about 4-5 minutes per side. Remove the bacon and place it on paper towels to drain. In the same skillet, add butter if needed and crack the eggs into the pan. Cook sunny-side-up, or to your preferred doneness, and season with salt and pepper. Serve the eggs and bacon together with toast or hash browns, if desired.",
    "categories": ["breakfast", "american"],
    "image": "assets/imgs/eggs_and_bacon.jpg"
},
{
    id: 10,
    name: "Chocolate Cake",
    shortDisc: "A decadent and moist chocolate cake, perfect for celebrations or indulgent moments.",
    ingredients: [
        "200g Chocolate",
        "200g Flour",
        "200g Sugar",
        "3 Eggs",
        "100g Butter"
    ],
    preparation: "Preheat your oven to 180°C (356°F) and grease a round cake tin. Melt the chocolate and butter together in a heatproof bowl over a pot of simmering water or in the microwave, stirring until smooth. In a separate bowl, whisk the eggs and sugar until light and fluffy. Gradually fold in the melted chocolate mixture. Sift in the flour and gently fold it into the batter until combined. Pour the batter into the prepared tin and bake for 30-35 minutes or until a toothpick inserted into the center comes out clean. Allow the cake to cool completely before frosting with your favorite chocolate icing or ganache. Slice and serve.",
    categories: ["dessert", "cake"],
    image: "assets/imgs/Chocolate_Cake.jpg"
},
{
    id: 11,
    name: "Vegetable Stir-Fry",
    shortDisc: "A delightful medley of fresh, colorful vegetables sautéed in soy sauce, perfect for a quick and healthy meal.",
    ingredients: [
        "200g Broccoli florets",
        "1 Carrot, julienned",
        "1 Bell pepper, sliced",
        "2 Garlic cloves, minced",
        "2 tbsp Soy sauce",
        "1 tbsp Olive oil",
        "Salt and pepper to taste"
    ],
    preparation: "Begin by heating olive oil in a large pan or wok over medium-high heat. Add the minced garlic and sauté for 30 seconds until fragrant. Add the broccoli, carrot, and bell pepper to the pan. Stir-fry the vegetables for 4-5 minutes until they start to soften but still retain some crunch. Pour in the soy sauce and stir well to coat the vegetables evenly. Cook for an additional 2 minutes. Season with salt and pepper to taste, then serve immediately as a side dish or with steamed rice.",
    categories: ["vegetarian", "asian"],
    image: "assets/imgs/Vegetable_Stir-Fry.jpg"
},
{
    id: 12,
    name: "Grilled Salmon",
    shortDisc: "Juicy and flavorful salmon fillets grilled to perfection with a tangy lemon herb marinade for a satisfying main dish.",
    ingredients: [
        "2 Salmon fillets",
        "1 Lemon, juiced",
        "2 tbsp Olive oil",
        "1 tsp Dried oregano",
        "Salt and pepper to taste"
    ],
    preparation: "Combine the lemon juice, olive oil, dried oregano, salt, and pepper in a small bowl to make the marinade. Place the salmon fillets in a shallow dish and pour the marinade over them, ensuring they are evenly coated. Let the salmon marinate for at least 15 minutes. Preheat the grill to medium heat and lightly oil the grates. Grill the salmon fillets skin-side down for 5-7 minutes, then flip and cook for another 3-4 minutes until the fish is opaque and flakes easily. Serve hot with a side of vegetables or rice.",
    categories: ["main-course", "seafood"],
    image: "assets/imgs/Grilled_Salmon.jpg"
},
{
    "id": 13,
    "name": "Shepherd's Pie",
    "shortDisc": "A comforting British casserole made with minced lamb, vegetables, and creamy mashed potatoes.",
    "ingredients": [
        "500g Minced lamb",
        "1 Onion, chopped",
        "2 Carrots, diced",
        "2 Garlic cloves, minced",
        "1 cup Frozen peas",
        "2 tbsp Tomato paste",
        "1 cup Beef stock",
        "1 tsp Worcestershire sauce",
        "4 Potatoes, peeled and boiled",
        "2 tbsp Butter",
        "1/4 cup Milk",
        "Salt and pepper, to taste"
    ],
    "preparation": "Preheat the oven to 375°F (190°C). In a skillet, sauté the onion, carrots, and garlic until softened. Add the minced lamb and cook until browned. Stir in tomato paste, beef stock, Worcestershire sauce, and peas. Simmer for 10 minutes. Mash the boiled potatoes with butter, milk, salt, and pepper. Transfer the lamb mixture to a baking dish, top with the mashed potatoes, and spread evenly. Bake for 20-25 minutes, until golden brown on top. Serve hot.",
    "categories": ["main-course", "british"],
    "image": "assets/imgs/shepherds_pie.jpg"
},
{
    "id": 14,
    "name": "Onigiri",
    "shortDisc": "A simple and delicious Japanese rice ball snack, filled with savory ingredients and wrapped in seaweed.",
    "ingredients": [
        "2 cups Cooked sushi rice",
        "2 tbsp Soy sauce",
        "1/2 cup Tuna, mixed with mayonnaise",
        "1/4 cup Pickled vegetables (optional)",
        "Nori sheets, cut into strips",
        "Salt, to taste"
    ],
    "preparation": "Wet your hands with water and sprinkle them with salt. Take a handful of sushi rice and flatten it in your palm. Place a spoonful of tuna mayo or pickled vegetables in the center. Fold the rice around the filling to form a ball or triangle shape. Wrap with a strip of nori and serve immediately, or store in plastic wrap for later.",
    "categories": ["Appetizer", "snack", "japanese"],
    "image": "assets/imgs/onigiri.jpg"
},
{
    "id": 15,
    "name": "Vegetable Chow Mein",
    "shortDisc": "Classic Chinese stir-fried noodles loaded with colorful vegetables in a savory sauce.",
    "ingredients": [
        "200g Chow mein noodles",
        "1 Carrot, julienned",
        "1 Bell pepper, sliced",
        "1 Zucchini, sliced",
        "1 Onion, sliced",
        "3 Garlic cloves, minced",
        "3 tbsp Soy sauce",
        "2 tbsp Oyster sauce",
        "1 tsp Sesame oil",
        "2 tbsp Vegetable oil",
        "1 tsp Sugar"
    ],
    "preparation": "Cook the chow mein noodles according to the package instructions and set aside. Heat vegetable oil in a wok or skillet over medium-high heat. Add garlic and onion, sautéing until fragrant. Add the carrot, bell pepper, and zucchini, stir-frying until tender-crisp. In a small bowl, mix soy sauce, oyster sauce, sesame oil, and sugar. Add the cooked noodles to the pan and pour the sauce over them. Toss everything together until well combined and heated through. Serve hot.",
    "categories": ["main-course", "chinese", "vegetarian"],
    "image": "assets/imgs/vegetable_chow_mein.jpg"
},
{
    "id": 16,
    "name": "Creamy Corn Chowder",
    "shortDisc": "A rich and hearty American soup made with sweet corn, potatoes, and cream.",
    "ingredients": [
        "3 cups Corn kernels (fresh, frozen, or canned)",
        "2 Potatoes, peeled and diced",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "3 cups Chicken or vegetable broth",
        "1 cup Heavy cream",
        "2 tbsp Butter",
        "2 tbsp All-purpose flour",
        "1/2 tsp Paprika",
        "Salt and pepper, to taste",
        "2 tbsp Fresh parsley, chopped (for garnish)"
    ],
    "preparation": "In a large pot, melt butter over medium heat. Add onion and garlic, sautéing until softened. Stir in flour and cook for 1 minute. Gradually add the broth while whisking to avoid lumps. Add potatoes, corn, paprika, salt, and pepper. Bring to a boil, then reduce heat and simmer for 15-20 minutes, or until the potatoes are tender. Stir in the heavy cream and cook for another 5 minutes. Use an immersion blender to puree a portion of the soup for a thicker texture, if desired. Serve hot, garnished with fresh parsley.",
    "categories": ["Appetizer","soup", "american"],
    "image": "assets/imgs/creamy_corn_chowder.jpg"
},
{
    id: 17,
    name: "Peking Duck",
    shortDisc: "Crispy and succulent roast duck seasoned with aromatic spices and served with a tangy hoisin sauce.",
    ingredients: [
        "1 Duck, whole",
        "2 tbsp Hoisin sauce",
        "1 tbsp Soy sauce",
        "1 tsp Five-spice powder",
        "1 Orange, juiced"
    ],
    preparation: "Preheat the oven to 180°C (350°F). Clean and pat the duck dry. Rub the five-spice powder, soy sauce, and orange juice all over the duck, including inside the cavity. Place the duck on a roasting rack and roast for 1.5-2 hours until the skin is crispy and golden. Brush with hoisin sauce during the last 15 minutes of cooking. Let rest before carving and serve with pancakes or rice.",
    categories: ["main-course", "chinese"],
    image: "assets/imgs/Peking_Duck.jpg"
},
{
    "id": 18,
    "name": "Chicken Ramen",
    "shortDisc": "A comforting bowl of Japanese ramen with tender chicken, noodles, and a savory broth.",
    "ingredients": [
        "200g Ramen noodles",
        "2 Chicken breasts, cooked and shredded",
        "4 cups Chicken broth",
        "2 tbsp Soy sauce",
        "1 tbsp Miso paste",
        "2 Garlic cloves, minced",
        "1-inch piece Ginger, grated",
        "2 Boiled eggs, halved",
        "1 cup Mushrooms, sliced",
        "1/2 cup Green onions, sliced",
        "1 tbsp Sesame oil"
    ],
    "preparation": "In a pot, heat sesame oil and sauté garlic and ginger until fragrant. Add chicken broth, soy sauce, and miso paste, stirring until combined. Bring to a simmer and add mushrooms. Cook for 5 minutes. In the meantime, cook the ramen noodles according to package instructions and divide them into serving bowls. Top the noodles with shredded chicken, boiled eggs, and green onions. Pour the hot broth over the noodles and serve immediately.",
    "categories": ["main-course", "japanese"],
    "image": "assets/imgs/chicken_ramen.jpg"
},
{
    id: 19,
    name: "Pasta Primavera",
    shortDisc: "A light and refreshing pasta dish featuring a medley of fresh, seasonal vegetables in a delicate garlic sauce.",
    ingredients: [
        "200g Pasta",
        "1 Zucchini, sliced",
        "1 Bell pepper, sliced",
        "1 Tomato, diced",
        "2 Garlic cloves, minced",
        "2 tbsp Olive oil",
        "Parmesan cheese for topping"
    ],
    preparation: "Cook the pasta according to package instructions. In a large skillet, heat olive oil and sauté the garlic until fragrant. Add the zucchini, bell pepper, and tomato, cooking until tender. Toss the cooked pasta with the sautéed vegetables and season with salt and pepper. Sprinkle with Parmesan cheese before serving.",
    categories: ["main-course", "vegetarian"],
    image: "assets/imgs/Pasta_Primavera.jpg"
},
{
    id: 20,
    name: "Banoffee Pie",
    shortDisc: "A luscious dessert layered with sweet bananas, creamy toffee, and light whipped cream on a biscuit crust.",
    ingredients: [
        "200g Digestive biscuits",
        "100g Butter, melted",
        "2 Bananas, sliced",
        "200ml Heavy cream",
        "100g Toffee sauce"
    ],
    preparation: "Crush the digestive biscuits into fine crumbs and mix with melted butter. Press the mixture into a pie dish to form the base and chill in the fridge for 15 minutes. Layer the sliced bananas over the crust, then drizzle generously with toffee sauce. Whip the cream until soft peaks form and spread it over the top. Chill for an hour before serving.",
    categories: ["dessert", "pie"],
    image: "assets/imgs/Banoffee_Pie.jpg"
},
{
    id: 21,
    name: "Chicken Tikka Masala",
    shortDisc: "A creamy and aromatic Indian curry featuring tender chicken pieces in a spiced tomato-based sauce.",
    ingredients: [
        "500g Chicken breast, cubed",
        "200g Tomato puree",
        "100ml Cream",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1 tbsp Ginger, grated",
        "2 tsp Garam masala",
        "1 tsp Turmeric",
        "1 tbsp Olive oil"
    ],
    preparation: "Heat oil in a pan and sauté the onion, garlic, and ginger until golden. Add the chicken cubes and cook until lightly browned. Stir in garam masala and turmeric, then add tomato puree and cream. Simmer for 20 minutes until the chicken is tender and the sauce thickens. Serve with naan or steamed rice.",
    categories: ["main-course", "indian"],
    image: "assets/imgs/chicken_tikka_masala.jpg"
},
{
    id: 22,
    name: "Lasagna",
    shortDisc: "A classic Italian layered pasta dish with rich meat sauce, creamy béchamel, and melted cheese.",
    ingredients: [
        "300g Ground beef",
        "9 Lasagna sheets",
        "200g Tomato sauce",
        "250g Ricotta cheese",
        "100g Mozzarella cheese",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "500ml Béchamel sauce"
    ],
    preparation: "Preheat the oven to 180°C (350°F). Sauté onion and garlic, then add ground beef and tomato sauce to prepare the meat sauce. Layer cooked lasagna sheets with meat sauce, ricotta, and béchamel in a baking dish. Top with mozzarella cheese and bake for 25-30 minutes until golden and bubbly.",
    categories: ["main-course", "italian"],
    image: "assets/imgs/lasagna.jpg"
},
{
    id: 23,
    name: "Chili Con Carne",
    shortDisc: "A hearty Mexican stew packed with spicy flavors, ground beef, beans, and a kick of chili.",
    ingredients: [
        "300g Ground beef",
        "200g Red beans",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "2 tbsp Chili powder",
        "1 tbsp Cumin",
        "500ml Tomato sauce",
        "1 Bell pepper, chopped"
    ],
    preparation: "In a large pot, sauté the onion and garlic. Add ground beef and cook until browned. Stir in chili powder, cumin, and tomato sauce. Add beans and bell pepper, simmer for 30 minutes. Adjust seasoning and serve with rice or tortilla chips.",
    categories: ["main-course", "mexican"],
    image: "assets/imgs/chili_con_carne.jpg"
},
{
    id: 24,
    name: "Pad Thai",
    shortDisc: "A flavorful Thai stir-fried noodle dish with shrimp, tangy tamarind sauce, and crushed peanuts.",
    ingredients: [
        "200g Rice noodles",
        "150g Shrimp, peeled",
        "2 Eggs",
        "1 Onion, chopped",
        "2 tbsp Tamarind paste",
        "1 tbsp Fish sauce",
        "1 tbsp Sugar",
        "1 tbsp Peanuts, crushed"
    ],
    preparation: "Soak rice noodles in warm water until softened. In a wok, cook shrimp and onion until fragrant. Push aside and scramble eggs. Add noodles, tamarind paste, fish sauce, and sugar. Toss until combined, then top with crushed peanuts and serve hot.",
    categories: ["main-course", "thai"],
    image: "assets/imgs/pad_thai.jpg"
},
{
    id: 25,
    name: "Stuffed Bell Peppers",
    shortDisc: "Bell peppers filled with a savory mixture of rice, ground beef, and rich tomato sauce.",
    ingredients: [
        "4 Bell peppers",
        "200g Ground beef",
        "1 Onion, chopped",
        "100g Rice",
        "2 Garlic cloves, minced",
        "200g Tomato sauce",
        "1 tbsp Olive oil"
    ],
    preparation: "Preheat the oven to 180°C (350°F). Cut the tops off the bell peppers and remove seeds. Sauté onion and garlic, then mix with cooked rice, ground beef, and tomato sauce. Stuff the peppers with the mixture and bake for 30 minutes.",
    categories: ["main-course", "vegetarian"],
    image: "assets/imgs/stuffed_bell_peppers.jpg"
},
{
    id: 26,
    name: "Falafel Wrap",
    shortDisc: "A delicious wrap filled with crispy falafel, fresh vegetables, and creamy tahini sauce.",
    ingredients: [
        "4 Falafel balls",
        "2 Tortillas",
        "1 Tomato, sliced",
        "1 Lettuce, shredded",
        "50g Tahini sauce"
    ],
    preparation: "Warm the tortillas and layer with lettuce, tomato slices, cucumber, ment, salt, lemom, pickle, and falafel balls. Drizzle tahini sauce generously and roll tightly. Serve immediately or wrap for on-the-go meals.",
    categories: ["appetizer", "breakfast", "middle-eastern"],
    image: "assets/imgs/falafel_wrap.jpg"
},
{
    "id": 27,
    "name": "Classic American Pancakes",
    "shortDisc": "Fluffy pancakes served with butter and maple syrup, a staple of American breakfasts.",
    "ingredients": [
        "1 1/2 cups All-purpose flour",
        "3 1/2 tsp Baking powder",
        "1 tsp Salt",
        "1 tbsp Sugar",
        "1 1/4 cups Milk",
        "1 Egg",
        "3 tbsp Butter, melted",
        "Maple syrup and butter, for serving"
    ],
    "preparation": "In a large bowl, mix flour, baking powder, salt, and sugar. In another bowl, whisk together milk, egg, and melted butter. Pour the wet ingredients into the dry ingredients and stir until just combined (some lumps are okay). Heat a non-stick skillet over medium heat and lightly grease with butter or oil. Pour 1/4 cup of batter onto the skillet for each pancake. Cook until bubbles form on the surface, then flip and cook the other side until golden brown. Serve hot with butter and maple syrup.",
    "categories": ["breakfast", "american", "snack", "dessert"],
    "image": "assets/imgs/clacssic_pancakes.jpg"
},
{
    id: 28,
    name: "Pumpkin Soup",
    shortDisc: "A smooth and creamy soup with roasted pumpkin and a hint of warm spices.",
    ingredients: [
        "500g Pumpkin, peeled and chopped",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "500ml Vegetable broth",
        "1 tsp Cinnamon",
        "1 tsp Nutmeg",
        "50ml Cream"
    ],
    preparation: "Roast pumpkin pieces in the oven at 180°C (350°F) until soft. In a pot, sauté onion and garlic, then add roasted pumpkin, broth, and spices. Simmer for 10 minutes and blend until smooth. Stir in cream and serve hot.",
    categories: ["appetizer", "vegetarian", "soup"],
    image: "assets/imgs/pumpkin_soup.jpg"
},
{
    id: 29,
    name: "Beef Wellington",
    shortDisc: "A gourmet dish of tender beef wrapped in mushroom duxelles and flaky puff pastry.",
    ingredients: [
        "500g Beef fillet",
        "200g Mushrooms, chopped",
        "2 tbsp Dijon mustard",
        "1 sheet Puff pastry",
        "1 Egg, beaten"
    ],
    preparation: "Season the beef and sear on all sides. Prepare mushroom duxelles by sautéing mushrooms until dry. Spread mustard and duxelles over the beef, wrap in puff pastry, and brush with beaten egg. Bake at 200°C (390°F) for 25-30 minutes until golden.",
    categories: ["main-course", "british"],
    image: "assets/imgs/beef_wellington.jpg"
},
{
    id: 30,
    name: "Apple Pie",
    shortDisc: "A timeless dessert with sweet, spiced apples encased in a flaky golden crust.",
    ingredients: [
        "5 Apples, peeled and sliced",
        "200g Flour",
        "100g Butter",
        "100g Sugar",
        "1 tsp Cinnamon",
        "1 Egg, beaten"
    ],
    preparation: "Preheat the oven to 180°C (350°F). Prepare the crust by mixing flour, butter, and water until dough forms. Roll out and line a pie dish. Fill with apple slices mixed with sugar and cinnamon. Cover with another crust layer, brush with beaten egg, and bake until golden.",
    categories: ["dessert", "pie"],
    image: "assets/imgs/apple_pie.jpg"
},
{
    id: 31,
    name: "Moussaka",
    shortDisc: "A rich and flavorful Greek casserole with layers of eggplant, spiced minced meat, and creamy béchamel sauce.",
    ingredients: [
        "2 Eggplants, sliced",
        "300g Ground lamb",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "200g Tomato sauce",
        "250ml Béchamel sauce",
        "1 tsp Cinnamon",
        "50g Parmesan cheese"
    ],
    preparation: "Begin by salting the sliced eggplants and letting them sit for 20 minutes to remove excess moisture. Rinse and pat dry. Fry or roast the eggplant slices until golden and set aside. In a pan, cook the ground lamb with chopped onion and garlic until browned. Add the tomato sauce, cinnamon, salt, and pepper, and let the mixture simmer for 15 minutes. Preheat the oven to 180°C (350°F). In a baking dish, layer half of the eggplants, followed by the meat mixture, and then another layer of eggplants. Pour the béchamel sauce over the top and sprinkle with Parmesan cheese. Bake for 30-40 minutes, or until the top is golden brown. Allow it to cool slightly before serving.",
    categories: ["main-course", "greek"],
    image: "assets/imgs/moussaka.jpg"
},
{
    id: 32,
    name: "Baked Ziti",
    shortDisc: "A hearty Italian pasta bake loaded with marinara sauce, melted mozzarella, and Parmesan cheese.",
    ingredients: [
        "300g Ziti pasta",
        "500g Marinara sauce",
        "200g Mozzarella cheese",
        "100g Parmesan cheese",
        "1 Onion, chopped",
        "2 Garlic cloves, minced"
    ],
    preparation: "Start by boiling the ziti pasta in salted water until al dente. Drain and set aside. In a large skillet, sauté the chopped onion and garlic until fragrant, then add the marinara sauce and let it simmer for 10 minutes. Preheat the oven to 190°C (375°F). In a large baking dish, layer half of the cooked pasta, followed by half of the sauce, and then half of the cheeses. Repeat the layers, finishing with a generous topping of mozzarella and Parmesan cheese. Cover with foil and bake for 20 minutes. Remove the foil and bake for another 10 minutes, or until the cheese is bubbly and golden. Let it rest for 5 minutes before serving.",
    categories: ["main-course", "italian"],
    image: "assets/imgs/baked_ziti.jpg"
},
{
    id: 33,
    name: "Chicken Fajitas",
    shortDisc: "Juicy chicken strips with colorful peppers and onions, served in warm tortillas with delicious toppings.",
    ingredients: [
        "300g Chicken breast, sliced",
        "1 Bell pepper, sliced",
        "1 Onion, sliced",
        "2 tbsp Fajita seasoning",
        "4 Tortillas",
        "Sour cream and salsa for serving"
    ],
    preparation: "In a large bowl, toss the sliced chicken with fajita seasoning until well coated. Heat a skillet over medium-high heat and add a tablespoon of oil. Cook the chicken until browned and fully cooked, then remove and set aside. In the same skillet, add the sliced onions and bell peppers, cooking until they are softened and slightly charred. Return the chicken to the skillet and mix everything together. Warm the tortillas in a dry pan or microwave. Serve the fajita mixture hot, allowing each person to assemble their tortillas with chicken, vegetables, and optional toppings like sour cream and salsa.",
    categories: ["main-course", "mexican"],
    image: "assets/imgs/chicken_fajitas.jpg"
},
{
    id: 34,
    name: "Ratatouille",
    shortDisc: "A vibrant French vegetable stew made with zucchini, eggplant, bell peppers, and tomatoes.",
    ingredients: [
        "1 Zucchini, sliced",
        "1 Eggplant, sliced",
        "2 Tomatoes, chopped",
        "1 Bell pepper, chopped",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "Olive oil"
    ],
    preparation: "Begin by heating olive oil in a large skillet over medium heat. Sauté the chopped onion and garlic until fragrant. Add the zucchini, eggplant, bell pepper, and tomatoes to the skillet. Season with salt, pepper, and herbs such as thyme or basil. Stir well and cover the skillet, reducing the heat to low. Let the vegetables simmer for about 30 minutes, stirring occasionally, until they are tender and the flavors are well combined. Serve hot as a side dish or with crusty bread for a light meal.",
    categories: ["main-course", "french"],
    image: "assets/imgs/ratatouille.jpg"
},
{
    id: 35,
    name: "Crispy Fish Tacos",
    shortDisc: "Crispy, golden fish fillets served in soft tortillas with a tangy cabbage slaw.",
    ingredients: [
        "4 White fish fillets",
        "1 cup Flour",
        "1 tsp Paprika",
        "1 tsp Cumin",
        "1 tbsp Olive oil",
        "4 Tortillas",
        "Cabbage slaw for topping"
    ],
    preparation: "Pat the fish fillets dry and season with salt and pepper. In a shallow dish, mix the flour, paprika, and cumin. Coat the fish fillets in the flour mixture, ensuring they are evenly covered. Heat a skillet with olive oil over medium heat and fry the fish until golden and crispy on both sides. Warm the tortillas in a pan or microwave. Assemble the tacos by placing the crispy fish on the tortillas and topping with cabbage slaw. Serve immediately with lime wedges and your favorite sauces.",
    categories: ["main-course", "mexican", "seafood"],
    image: "assets/imgs/crispy_fish_tacos.jpg"
},
{
    id: 36,
    name: "Spinach and Ricotta Stuffed Pasta Shells",
    shortDisc: "Jumbo pasta shells filled with creamy spinach and ricotta, baked with marinara sauce and cheese.",
    ingredients: [
        "12 Jumbo pasta shells",
        "200g Ricotta cheese",
        "200g Spinach, wilted",
        "1 cup Mozzarella cheese",
        "500ml Marinara sauce"
    ],
    preparation: "Cook the jumbo pasta shells in salted boiling water until al dente. Drain and set aside. Combine the ricotta cheese, wilted spinach, and half of the mozzarella in a mixing bowl, seasoning with salt and pepper. Preheat the oven to 180°C (350°F). Spread marinara sauce in a baking dish. Stuff each shell with the ricotta mixture and place in the dish. Top with remaining marinara sauce and cheese. Cover with foil and bake for 25 minutes, then uncover and bake for 10 more minutes until bubbly and golden. Let cool slightly before serving.",
    categories: ["main-course", "italian"],
    image: "assets/imgs/spinach_ricotta_shells.jpg"
},
{
    id: 37,
    name: "Vegetarian Pizza",
    shortDisc: "A crisp pizza base topped with fresh vegetables and gooey mozzarella cheese.",
    ingredients: [
        "1 Pizza dough",
        "100g Tomato sauce",
        "100g Mozzarella cheese",
        "1 Red onion, sliced",
        "1 Bell pepper, sliced",
        "Olives and mushrooms"
    ],
    preparation: "Preheat the oven to 220°C (430°F). Roll out the pizza dough on a floured surface and place on a baking sheet. Spread tomato sauce evenly over the dough, leaving a small border. Add mozzarella cheese, then top with sliced vegetables like onions, bell peppers, olives, and mushrooms. Bake for 15-20 minutes, or until the crust is golden and the cheese is melted. Serve hot, optionally garnished with fresh basil leaves.",
    categories: ["main-course", "italian"],
    image: "assets/imgs/vegetarian_pizza.jpg"
},
{
    id: 38,
    name: "BBQ Chicken Wings",
    shortDisc: "Juicy chicken wings baked or grilled with a tangy BBQ sauce glaze.",
    ingredients: [
        "10 Chicken wings",
        "1 cup BBQ sauce",
        "1 tbsp Olive oil",
        "1 tsp Paprika",
        "Salt and pepper to taste"
    ],
    preparation: "Preheat the oven to 200°C (400°F). Toss the chicken wings with olive oil, paprika, salt, and pepper. Arrange them in a single layer on a baking sheet. Bake for 20 minutes, then brush generously with BBQ sauce. Turn the wings over, brush the other side with sauce, and bake for an additional 15-20 minutes until they are caramelized and crispy. Serve hot with extra BBQ sauce on the side.",
    categories: ["main-course", "american"],
    image: "assets/imgs/bbq_chicken_wings.jpg"
},
{
    id: 39,
    name: "Lobster Roll",
    shortDisc: "Tender lobster meat lightly dressed with mayo, served in buttery rolls.",
    ingredients: [
        "200g Lobster meat",
        "4 Rolls",
        "2 tbsp Mayonnaise",
        "1 tbsp Lemon juice",
        "1 tbsp Fresh parsley"
    ],
    preparation: "In a bowl, mix the lobster meat with mayonnaise, lemon juice, and parsley. Toast the rolls with a little butter until golden. Fill each roll generously with the lobster mixture. Serve immediately with chips or a light salad.",
    categories: ["main-course", "seafood"],
    image: "assets/imgs/lobster_roll.jpg"
},
{
    id: 40,
    name: "Peach Cobbler",
    shortDisc: "A classic dessert with sweet peaches and a golden biscuit topping.",
    ingredients: [
        "4 Peaches, sliced",
        "100g Sugar",
        "1 tsp Cinnamon",
        "150g Flour",
        "100g Butter",
        "1 Egg"
    ],
    preparation: "Preheat the oven to 190°C (375°F). Toss the sliced peaches with sugar and cinnamon, then spread them evenly in a baking dish. In a bowl, mix flour, sugar, and butter until crumbly. Add the egg and mix to form a soft dough. Drop spoonfuls of the dough over the peaches, leaving some gaps for steam to escape. Bake for 30-35 minutes, or until the topping is golden and the peach filling is bubbling. Serve warm with a scoop of vanilla ice cream.",
    categories: ["dessert", "pie"],
    image: "assets/imgs/peach_cobbler.jpg"
},
{
    "id": 41,
    "name": "Vegetable Yakisoba",
    "shortDisc": "A flavorful stir-fried noodle dish with a medley of fresh vegetables and savory sauce.",
    "ingredients": [
        "200g Yakisoba noodles",
        "1 Carrot, julienned",
        "1 Bell pepper, sliced",
        "1/2 Cabbage, shredded",
        "1 Onion, sliced",
        "2 Garlic cloves, minced",
        "3 tbsp Soy sauce",
        "1 tbsp Oyster sauce",
        "1 tbsp Worcestershire sauce",
        "1 tsp Sesame oil",
        "1 tbsp Vegetable oil",
        "1 tsp Sugar"
    ],
    "preparation": "Prepare yakisoba noodles according to package instructions and set aside. Heat vegetable oil in a wok or large skillet. Add garlic and onion, stir-frying until fragrant. Add carrot, bell pepper, and cabbage, cooking until slightly softened. In a small bowl, mix soy sauce, oyster sauce, Worcestershire sauce, sesame oil, and sugar. Add the noodles to the skillet and pour the sauce over them. Toss everything together until well coated and heated through. Serve hot, garnished with sesame seeds or green onions if desired.",
    "categories": ["main-course", "japanese", "vegetarian"],
    "image": "assets/imgs/vegetable_yakisoba.jpg"
},
{
    "id": 42,
    "name": "Beef Kebabs",
    "shortDisc": "Grilled skewers of marinated beef, perfect for a BBQ.",
    "ingredients": [
        "500g Beef cubes",
        "1 Onion, chopped",
        "2 tbsp Olive oil",
        "1 tsp Cumin",
        "1 tsp Paprika",
        "Salt and pepper to taste"
    ],
    "preparation": "In a bowl, mix the beef cubes with chopped onion, olive oil, cumin, paprika, salt, and pepper. Marinate for 2-3 hours in the refrigerator. Preheat the grill to medium-high heat. Thread the marinated beef onto skewers and grill for 8-10 minutes, turning occasionally, until the beef is tender and slightly charred. Serve hot.",
    "categories": ["main-course", "grill"],
    "image": "assets/imgs/beef_kebabs.jpg"
},
{
    "id": 43,
    "name": "Avocado Toast",
    "shortDisc": "Creamy avocado spread on toasted bread, perfect for breakfast.",
    "ingredients": [
        "2 Avocados",
        "4 Slices of bread",
        "Lemon juice",
        "Salt and pepper",
        "Olive oil for drizzling"
    ],
    "preparation": "Peel and mash the avocados in a bowl, adding a squeeze of lemon juice and seasoning with salt and pepper. Toast the bread slices until golden brown. Spread the mashed avocado onto the toast and drizzle with a little olive oil. Serve immediately.",
    "categories": ["breakfast", "snack"],
    "image": "assets/imgs/avocado_toast.jpg"
},
{
    "id": 44,
    "name": "Tomato Basil Soup",
    "shortDisc": "A warm and comforting soup made with fresh tomatoes and basil.",
    "ingredients": [
        "4 Tomatoes, chopped",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1 tbsp Olive oil",
        "1 tsp Basil",
        "500ml Vegetable broth",
        "Cream for garnish"
    ],
    "preparation": "Heat olive oil in a pot over medium heat. Sauté the chopped onions and minced garlic until softened. Add the chopped tomatoes, basil, and vegetable broth. Simmer for 20-25 minutes. Use a blender to puree the soup until smooth. Garnish with a swirl of cream and serve hot.",
    "categories": ["appetizer", "vegetarian", "soup"],
    "image": "assets/imgs/tomato_basil_soup.jpg"
},
{
    "id": 45,
    "name": "Samosas",
    "shortDisc": "Crispy pastry filled with spiced potatoes and peas.",
    "ingredients": [
        "2 Potatoes, boiled and mashed",
        "100g Peas, cooked",
        "1 Onion, chopped",
        "2 tsp Garam masala",
        "1 tsp Cumin",
        "Samosa wrappers or spring roll wrappers"
    ],
    "preparation": "Mix the mashed potatoes, cooked peas, chopped onions, garam masala, and cumin in a bowl. Place a spoonful of the filling onto each wrapper, fold into triangles, and seal the edges with water. Heat oil in a deep pan and fry the samosas in batches until golden brown. Drain on paper towels and serve hot.",
    "categories": ["appetizer", "indian"],
    "image": "assets/imgs/samosas.jpg"
},
{
    "id": 46,
    "name": "English Scones",
    "shortDisc": "Classic British scones, perfect for tea time, served with clotted cream and jam.",
    "ingredients": [
        "2 cups All-purpose flour",
        "2 tsp Baking powder",
        "1/4 cup Sugar",
        "1/4 tsp Salt",
        "5 tbsp Butter, chilled and cubed",
        "1/2 cup Milk",
        "1 Egg, beaten (for brushing)",
        "Clotted cream and jam, for serving"
    ],
    "preparation": "Preheat the oven to 400°F (200°C). In a bowl, mix flour, baking powder, sugar, and salt. Add the butter and rub it into the flour mixture until it resembles breadcrumbs. Gradually add milk and mix until a dough forms. Roll out the dough to about 1-inch thickness and use a round cutter to shape the scones. Place them on a baking tray, brush the tops with beaten egg, and bake for 12-15 minutes, or until golden brown. Serve warm with clotted cream and jam.",
    "categories": ["dessert", "british"],
    "image": "assets/imgs/english_scones.jpg"
},
{
    "id": 47,
    "name": "Mango Chutney Chicken",
    "shortDisc": "Sweet and tangy chicken cooked with mango chutney.",
    "ingredients": [
        "500g Chicken breast, sliced",
        "100g Mango chutney",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1 tbsp Olive oil",
        "Cilantro for garnish"
    ],
    "preparation": "Heat olive oil in a skillet over medium heat. Sauté the onions and garlic until softened. Add the chicken slices and cook until browned. Stir in the mango chutney and simmer for 10 minutes until the chicken is fully cooked. Garnish with cilantro and serve hot.",
    "categories": ["main-course", "indian"],
    "image": "assets/imgs/mango_chutney_chicken.jpg"
},
{
    "id": 48,
    "name": "Shrimp Ceviche",
    "shortDisc": "Fresh shrimp marinated in lime juice, mixed with tomatoes and cilantro.",
    "ingredients": [
        "300g Shrimp, peeled and chopped",
        "1 Tomato, chopped",
        "1 Red onion, chopped",
        "1/2 cup Cilantro, chopped",
        "Juice of 2 limes",
        "1 Jalapeño, chopped"
    ],
    "preparation": "Place the shrimp in a bowl and pour lime juice over them. Let marinate for 30 minutes until opaque. Mix with the chopped tomato, red onion, cilantro, and jalapeño. Chill for another 20 minutes before serving.",
    "categories": ["appetizer", "mexican"],
    "image": "assets/imgs/shrimp_ceviche.jpg"
},
{
    "id": 49,
    "name": "Kung Pao Chicken",
    "shortDisc": "A spicy and savory Chinese stir-fry dish with chicken, peanuts, and vegetables in a flavorful sauce.",
    "ingredients": [
        "500g Chicken breast, cubed",
        "1 Bell pepper, diced",
        "1/2 cup Roasted peanuts",
        "2 Green onions, chopped",
        "3 Garlic cloves, minced",
        "1-inch Ginger, minced",
        "3 tbsp Soy sauce",
        "2 tbsp Hoisin sauce",
        "1 tbsp Rice vinegar",
        "1 tsp Cornstarch",
        "2 tbsp Vegetable oil",
        "1 tsp Dried chili flakes (optional)"
    ],
    "preparation": "In a bowl, mix soy sauce, hoisin sauce, rice vinegar, and cornstarch to create the sauce. Heat vegetable oil in a wok or skillet over medium-high heat. Add the chicken and cook until golden brown. Remove the chicken and set aside. In the same pan, sauté garlic, ginger, and chili flakes for 30 seconds. Add the bell pepper and cook for 2-3 minutes. Return the chicken to the pan, pour the sauce, and stir until everything is coated. Toss in peanuts and green onions before serving with steamed rice.",
    "categories": ["main-course", "chinese"],
    "image": "assets/imgs/kung_pao_chicken.jpg"
},
{
    "id": 50,
    "name": "Shish Tawook",
    "shortDisc": "Flavorful and tender marinated chicken skewers, a classic Middle Eastern dish.",
    "ingredients": [
        "500g Boneless chicken breast, cut into cubes",
        "3 tbsp Yogurt",
        "2 tbsp Lemon juice",
        "2 tbsp Olive oil",
        "2 Garlic cloves, minced",
        "1 tsp Paprika",
        "1 tsp Ground cumin",
        "1/2 tsp Turmeric",
        "1/2 tsp Ground coriander",
        "Salt and pepper, to taste"
    ],
    "preparation": "In a bowl, whisk together the yogurt, lemon juice, olive oil, garlic, paprika, cumin, turmeric, coriander, salt, and pepper to make the marinade. Add the chicken cubes and mix until well coated. Cover and refrigerate for at least 2 hours, or overnight for best results. Thread the marinated chicken onto skewers. Preheat a grill or grill pan to medium-high heat. Grill the skewers for 10-12 minutes, turning occasionally, until the chicken is fully cooked and slightly charred. Serve hot with garlic sauce, pita bread, or rice.",
    "categories": ["main-course", "grill", "middle-eastern"],
    "image": "assets/imgs/shish_tawook.jpg"
},
{
    "id": 51,
    "name": "Maqlooba (Upside Down Rice)",
    "shortDisc": "A famous Arab dish made with rice, vegetables, and meat, all cooked together and flipped upside down for a stunning presentation.",
    "ingredients": [
        "1 kg Eggplant, sliced",
        "500g Minced meat",
        "2 cups Rice",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1 tsp Cinnamon",
        "1 tsp Cardamom",
        "Salt and pepper to taste"
    ],
    "preparation": "Fry the eggplant slices until golden and set them aside. In a large pot, cook the minced meat with onions, garlic, cinnamon, and cardamom until the meat is browned and fragrant. Add rice and water or broth, then layer the fried eggplant on top. Cover and cook the rice mixture until done. Flip the pot upside down onto a serving platter, creating an impressive layered dish to serve.",
    "categories": ["main-course", "arabic"],
    "image": "assets/imgs/maklouba.jpg"
},
{
    "id": 52,
    "name": "Saudi Kabsa",
    "shortDisc": "A flavorful rice dish cooked with chicken, vegetables, and a blend of traditional spices, offering a taste of Saudi Arabia.",
    "ingredients": [
        "1 Chicken, cut into pieces",
        "2 cups Basmati rice",
        "1 Onion, chopped",
        "2 Tomatoes, chopped",
        "1 tbsp Kabsa spice mix",
        "1 tsp Turmeric",
        "3 cups Chicken broth",
        "Salt and pepper to taste"
    ],
    "preparation": "Start by cooking chicken with onions, tomatoes, and kabsa spices in a large pot. Once the chicken is golden, add turmeric, rice, and chicken broth, then season with salt and pepper. Cover and cook until the rice is tender and the flavors have melded together. This one-pot dish is full of bold spices and rich flavors.",
    "categories": ["main-course", "arabic"],
    "image": "assets/imgs/kabsa.jpg"
},
{
    "id": 53,
    "name": "Falafel",
    "shortDisc": "Crispy deep-fried patties made from chickpeas, fresh herbs, and spices, often served in pita with tahini sauce.",
    "ingredients": [
        "2 cups Chickpeas, soaked overnight",
        "1 Onion, chopped",
        "4 Garlic cloves, minced",
        "1 cup Parsley",
        "1 tsp Cumin",
        "1 tsp Coriander",
        "Salt and pepper to taste",
        "Oil for frying"
    ],
    "preparation": "Drain and rinse soaked chickpeas. Blend chickpeas, parsley, onions, garlic, cumin, and coriander in a food processor until smooth. Season with salt and pepper, then shape the mixture into small patties or balls. Heat oil in a frying pan and fry the falafel until golden brown and crispy. Serve in pita bread with salad and tahini sauce.",
    "categories": ["Appetizer", "breakfast", "arabic"],
    "image": "assets/imgs/falafel.jpg"
},
{
    "id": 54,
    "name": "Hummus",
    "shortDisc": "A smooth and creamy dip made from blended chickpeas, tahini, lemon juice, and garlic, perfect for dipping or spreading.",
    "ingredients": [
        "2 cups Chickpeas, cooked",
        "1/2 cup Tahini",
        "1/4 cup Lemon juice",
        "2 Garlic cloves",
        "Olive oil",
        "Salt to taste"
    ],
    "preparation": "Blend the cooked chickpeas with tahini, lemon juice, garlic, and a pinch of salt until smooth and creamy. Drizzle with olive oil and adjust seasoning to taste. This classic dip is perfect for serving with pita, vegetables, or as a spread.",
    "categories": ["Appetizer", "arabic"],
    "image": "assets/imgs/hummus.jpg"
},
{
    "id": 55,
    "name": "Shawarma",
    "shortDisc": "Marinated lamb, chicken, or beef, grilled to perfection and served in pita bread with garlic sauce and fresh vegetables.",
    "ingredients": [
        "500g Chicken thighs (or beef/lamb)",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1 tbsp Shawarma spice mix",
        "Pita bread",
        "Garlic sauce",
        "Tomatoes, cucumbers, and lettuce"
    ],
    "preparation": "Marinate the meat with shawarma spices, garlic, and onions for at least an hour. Grill the meat until perfectly charred and cooked through. Slice the grilled meat thinly and serve it in warm pita bread with garlic sauce, tomatoes, cucumbers, and lettuce for a delicious and satisfying meal.",
    "categories": ["main-course", "arabic"],
    "image": "assets/imgs/shawarma.jpg"
},
{
    "id": 56,
    "name": "Tabbouleh",
    "shortDisc": "A fresh, herby salad made with parsley, tomatoes, onions, and bulgur, seasoned with olive oil and lemon juice.",
    "ingredients": [
        "2 cups Parsley, chopped",
        "2 Tomatoes, chopped",
        "1 Onion, chopped",
        "1 cup Bulgur wheat",
        "1/4 cup Lemon juice",
        "Olive oil",
        "Salt and pepper to taste"
    ],
    "preparation": "Cook the bulgur wheat according to package instructions and let it cool. In a large bowl, combine chopped parsley, tomatoes, onions, and cooled bulgur. Drizzle with olive oil and lemon juice, then toss to combine. Season with salt and pepper to taste for a refreshing and healthy side dish.",
    "categories": ["Appetizer", "arabic"],
    "image": "assets/imgs/tabbouleh.jpg"
},
{
    "id": 57,
    "name": "Kofta",
    "shortDisc": "Ground meat mixed with spices, formed into skewers or patties, then grilled or fried for a juicy, flavorful dish.",
    "ingredients": [
        "500g Ground beef or lamb",
        "1 Onion, grated",
        "2 Garlic cloves, minced",
        "1 tsp Cumin",
        "1 tsp Coriander",
        "Salt and pepper to taste",
        "Olive oil for grilling"
    ],
    "preparation": "Mix the ground meat with grated onion, garlic, cumin, coriander, salt, and pepper until well combined. Form the mixture into small patties or thread it onto skewers. Grill or fry the kofta until cooked through and golden brown on the outside. Serve with pita, rice, or a side of yogurt.",
    "categories": ["main-course", "arabic"],
    "image": "assets/imgs/kofta.jpg"
},
{
    "id": 58,
    "name": "Baklava",
    "shortDisc": "A sweet, flaky pastry made with layers of phyllo dough, filled with chopped nuts and drizzled with honey syrup.",
    "ingredients": [
        "1 package Phyllo dough",
        "2 cups Walnuts or pistachios, chopped",
        "1 cup Butter, melted",
        "1 cup Sugar",
        "1 cup Water",
        "1 tbsp Lemon juice",
        "1 tbsp Honey"
    ],
    "preparation": "Layer phyllo dough in a baking dish, brushing each sheet with melted butter. Add a layer of chopped nuts and repeat until all ingredients are used. Bake the baklava until golden and crispy. While it bakes, make a syrup by boiling sugar, water, lemon juice, and honey until thickened. Once baked, pour the syrup over the hot baklava and let it soak in before serving.",
    "categories": ["dessert", "arabic"],
    "image": "assets/imgs/baklava.jpg"
},
{
    "id": 59,
    "name": "Knafeh",
    "shortDisc": "A popular Arabic dessert made with semolina dough, filled with sweet cheese, and soaked in rose water syrup.",
    "ingredients": [
        "500g Semolina dough",
        "250g Mozzarella cheese",
        "1/2 cup Butter, melted",
        "1 cup Sugar",
        "1 cup Water",
        "1 tbsp Rose water"
    ],
    "preparation": "Layer semolina dough and cheese in a baking dish, pouring melted butter over each layer. Bake until golden and crispy on the top. While it bakes, prepare the syrup by boiling sugar, water, and rose water. Once the knafeh is baked, pour the syrup over it and let it soak in. Serve warm for a sweet, decadent treat.",
    "categories": ["dessert", "arabic"],
    "image": "assets/imgs/knafeh.jpg"
},
{
    "id": 60,
    "name": "Fattoush",
    "shortDisc": "A refreshing salad made with mixed greens, crispy pita, and a tangy vinaigrette dressing.",
    "ingredients": [
        "2 cups Romaine lettuce, chopped",
        "2 Tomatoes, chopped",
        "1 Cucumber, chopped",
        "1 Onion, chopped",
        "2 Pita breads, toasted",
        "1/4 cup Lemon juice",
        "Olive oil",
        "Salt and pepper to taste"
    ],
    "preparation": "Toast the pita bread until crispy, then break it into bite-sized pieces. In a large bowl, combine chopped lettuce, tomatoes, cucumber, and onion. Add the toasted pita, then drizzle with olive oil, lemon juice, and season with salt and pepper to taste. Toss everything together and serve chilled for a refreshing appetizer.",
    "categories": ["Appetizer", "arabic"],
    "image": "assets/imgs/fattoush.jpg"
},
{
    "id": 61,
    "name": "Mint Tea",
    "shortDisc": "A refreshing tea infused with fresh mint leaves, a popular drink in many Arab countries.",
    "ingredients": [
        "1 cup Green tea leaves",
        "1 bunch Fresh mint leaves",
        "3 cups Water",
        "Sugar to taste"
    ],
    "preparation": "First, boil the water in a saucepan. Once boiling, add the green tea leaves and let them steep for about 3-5 minutes. Add the fresh mint leaves and sugar to taste, stirring to dissolve the sugar. Let it steep for a few more minutes to infuse the flavors. Serve hot in small cups, garnished with additional mint leaves if desired.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/mint_tea.jpg"
},
{
    "id": 62,
    "name": "Karkadeh (Hibiscus Tea)",
    "shortDisc": "A tangy and refreshing drink made from dried hibiscus flowers, commonly served cold.",
    "ingredients": [
        "1/2 cup Dried hibiscus flowers",
        "4 cups Water",
        "Sugar to taste",
        "Ice cubes"
    ],
    "preparation": "Begin by boiling the hibiscus flowers in 4 cups of water for about 10 minutes until the liquid turns a deep red color. Once boiled, strain the mixture into a pitcher, discarding the flowers. Add sugar to taste and stir until dissolved. Allow the tea to cool to room temperature, then refrigerate for 1-2 hours. Serve chilled over ice cubes for a refreshing drink.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/karkadeh.jpg"
},
{
    "id": 63,
    "name": "Tamarind Juice",
    "shortDisc": "A sweet and sour drink made from tamarind pulp, popular in the Middle East.",
    "ingredients": [
        "1/2 cup Tamarind pulp",
        "4 cups Water",
        "Sugar to taste",
        "Ice cubes"
    ],
    "preparation": "Soak the tamarind pulp in 4 cups of water for about 2-3 hours to soften it. Once soaked, strain the mixture into a large bowl, discarding any seeds or fibers. Add sugar to taste, stirring until fully dissolved. Refrigerate for at least an hour to chill. Serve cold over ice cubes for a sweet and tangy drink.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/tamarind_juice.jpg"
},
{
    "id": 64,
    "name": "Lemon Mint Cooler",
    "shortDisc": "A refreshing drink made with lemon juice, mint leaves, and soda water.",
    "ingredients": [
        "1/2 cup Fresh lemon juice",
        "1 bunch Mint leaves",
        "2 tbsp Sugar",
        "1 cup Soda water",
        "Ice cubes"
    ],
    "preparation": "Start by muddling the fresh mint leaves with the sugar in a tall glass to release the mint’s flavor. Then, add the fresh lemon juice and mix well. Fill the glass with ice cubes, then top with soda water, stirring gently to combine the ingredients. Serve chilled for a refreshing, tangy drink with a burst of mint.",
    "categories": ["drink", "refreshing"],
    "image": "assets/imgs/lemon_mint_cooler.jpg"
},
{
    "id": 65,
    "name": "Ayran",
    "shortDisc": "A salty, yogurt-based drink that is popular in Turkey and the Middle East.",
    "ingredients": [
        "1 cup Plain yogurt",
        "1/2 cup Water",
        "1/4 tsp Salt"
    ],
    "preparation": "In a large mixing bowl, whisk together the plain yogurt, water, and salt until smooth and frothy. Continue whisking for 2-3 minutes to create a creamy texture. You can adjust the salt to your preference. Serve chilled in glasses, garnished with a pinch of salt if desired for extra flavor.",
    "categories": ["drink", "middle-eastern"],
    "image": "assets/imgs/ayran.jpg"
},
{
    "id": 66,
    "name": "Rose Water Lemonade",
    "shortDisc": "A fragrant and floral lemonade flavored with rose water.",
    "ingredients": [
        "1/2 cup Fresh lemon juice",
        "1 tbsp Rose water",
        "2 cups Water",
        "Sugar to taste",
        "Ice cubes"
    ],
    "preparation": "Combine the fresh lemon juice, rose water, and sugar in a pitcher. Stir well until the sugar is completely dissolved. Add 2 cups of water to the mixture and stir again. Refrigerate the lemonade for at least an hour to chill. Serve over ice cubes for a fragrant, floral lemonade with a refreshing twist.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/rose_water_lemonade.jpg"
},
{
    "id": 67,
    "name": "Pineapple and Mint Smoothie",
    "shortDisc": "A tropical smoothie made with fresh pineapple, mint, and yogurt.",
    "ingredients": [
        "1 cup Fresh pineapple chunks",
        "1/2 cup Greek yogurt",
        "1/4 cup Fresh mint leaves",
        "1 tbsp Honey",
        "Ice cubes"
    ],
    "preparation": "In a blender, combine the fresh pineapple chunks, Greek yogurt, fresh mint leaves, honey, and ice cubes. Blend until smooth and creamy. You can add more honey if you prefer a sweeter smoothie. Serve immediately for a cool and tropical drink.",
    "categories": ["drink", "smoothie"],
    "image": "assets/imgs/pineapple_mint_smoothie.jpg"
},
{
    "id": 68,
    "name": "Sahlab",
    "shortDisc": "A creamy, warm drink made from orchid tuber flour, often served in the winter.",
    "ingredients": [
        "2 cups Milk",
        "2 tbsp Sahlab powder (orchid flour)",
        "2 tbsp Sugar",
        "Cinnamon for garnish",
        "Crushed pistachios for garnish"
    ],
    "preparation": "In a pot, combine the sahlab powder, milk, and sugar. Stir the mixture constantly while heating over medium heat until it thickens to a creamy consistency. Once thickened, pour the sahlab into serving cups. Garnish with a sprinkle of cinnamon and crushed pistachios for a warm, comforting drink.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/sahlab.jpg"
},
{
    "id": 69,
    "name": "Date Shake",
        "shortDisc": "A rich and sweet shake made with dates, milk, and ice cream.",
        "ingredients": [
            "10 Dates, pitted",
            "1 cup Milk",
            "1/2 cup Vanilla ice cream",
            "1/2 tsp Cinnamon (optional)"
        ],
    "preparation": "Blend the dates, milk, and vanilla ice cream in a blender until smooth and creamy. You can add a pinch of cinnamon for extra flavor. Blend again and taste to adjust sweetness if necessary. Pour into a glass and serve chilled for a sweet and indulgent treat.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/date_shake.jpg"
},
{
    "id": 70,
    "name": "Arabic Coffee (Qahwa)",
    "shortDisc": "Traditional Arabic coffee flavored with cardamom, often served in small cups.",
    "ingredients": [
        "3 tbsp Arabic coffee grounds",
        "3 cups Water",
        "1 tsp Ground cardamom",
        "Sugar to taste"
    ],
    "preparation": "In a small saucepan, bring the water to a boil, then add the Arabic coffee grounds and ground cardamom. Lower the heat and simmer for 5 minutes, stirring occasionally. Once the coffee has brewed, pour it into small cups. Add sugar to taste and serve hot for a rich, aromatic coffee experience.",
    "categories": ["drink", "arabic"],
    "image": "assets/imgs/arabic_coffee.jpg"
},
{
    "id": 71,
    "name": "Pelmeni",
    "shortDisc": "Traditional Russian dumplings filled with a savory meat mixture and served with sour cream.",
    "ingredients": [
        "2 cups All-purpose flour",
        "1/2 cup Water",
        "1 Egg",
        "1/2 tsp Salt",
        "250g Ground beef",
        "250g Ground pork",
        "1 Onion, finely chopped",
        "2 Garlic cloves, minced",
        "1/2 tsp Black pepper",
        "1/2 tsp Salt",
        "Sour cream, for serving"
    ],
    "preparation": "In a bowl, mix flour, water, egg, and salt to form a dough. Knead until smooth, then cover and let rest for 30 minutes. Meanwhile, prepare the filling by combining ground beef, ground pork, onion, garlic, salt, and pepper in a bowl. Roll out the dough thinly and cut into small circles. Place a teaspoon of filling in the center of each circle, fold the dough over, and pinch the edges to seal. Bring a large pot of salted water to a boil. Cook the pelmeni in batches for 7-10 minutes, or until they float to the surface. Serve hot with sour cream or melted butter.",
    "categories": ["main-course", "russian"],
    "image": "assets/imgs/pelmeni.jpg"
},
{
    "id": 72,
    "name": "Pepperoni Pizza",
    "shortDisc": "A pizza topped with spicy pepperoni slices, mozzarella cheese, and tomato sauce.",
    "ingredients": [
        "1 Pizza dough",
        "100g Tomato sauce",
        "150g Mozzarella cheese, shredded",
        "100g Pepperoni slices"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Roll out the pizza dough to your desired thickness on a floured surface. Spread the tomato sauce evenly over the dough. Sprinkle the shredded mozzarella cheese on top and arrange the pepperoni slices over the cheese. Bake for 10-12 minutes until the crust is golden and the cheese is melted and bubbly. Once done, remove from the oven and serve hot.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/pepperoni_pizza.jpg"
},
{
    "id": 73,
    "name": "Hawaiian Pizza",
    "shortDisc": "A sweet and savory pizza topped with ham, pineapple, and mozzarella cheese.",
    "ingredients": [
        "1 Pizza dough",
        "100g Tomato sauce",
        "150g Mozzarella cheese, shredded",
        "100g Ham, sliced",
        "100g Pineapple chunks"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Roll out the pizza dough to your desired size and thickness. Spread the tomato sauce evenly over the dough, then sprinkle the shredded mozzarella cheese over the sauce. Add the sliced ham and pineapple chunks on top. Bake in the preheated oven for 10-12 minutes, or until the crust is golden and the cheese is bubbling. Serve hot.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/hawaiian_pizza.jpg"
},
{
    "id": 74,
    "name": "BBQ Chicken Pizza",
    "shortDisc": "A smoky pizza topped with grilled chicken, barbecue sauce, red onions, and mozzarella.",
    "ingredients": [
        "1 Pizza dough",
        "100g BBQ sauce",
        "150g Grilled chicken, sliced",
        "1 Red onion, sliced",
        "150g Mozzarella cheese, shredded"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Roll out the pizza dough to your desired size. Spread BBQ sauce evenly over the dough. Add the grilled chicken slices, red onion rings, and shredded mozzarella cheese on top. Bake for 10-12 minutes, or until the crust is golden and the cheese is melted and bubbly. Remove from the oven and serve hot.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/bbq_chicken_pizza.jpg"
},
{
    "id": 75,
    "name": "Vegetarian Pizza",
    "shortDisc": "A healthy pizza topped with a variety of fresh vegetables like bell peppers, mushrooms, and olives.",
    "ingredients": [
        "1 Pizza dough",
        "100g Tomato sauce",
        "150g Mozzarella cheese, shredded",
        "1 Bell pepper, sliced",
        "100g Mushrooms, sliced",
        "50g Olives, sliced"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Roll out the pizza dough and spread a thin layer of tomato sauce. Sprinkle the shredded mozzarella cheese evenly over the dough. Add the sliced bell pepper, mushrooms, and olives. Bake the pizza for 10-12 minutes until the crust is golden and the cheese is melted and bubbly. Remove from the oven and serve hot.",
    "categories": ["main-course", "pizza", "vegetarian"],
    "image": "assets/imgs/vegetarian_pizza.jpg"
},
{
    "id": 76,
    "name": "Four Cheese Pizza",
    "shortDisc": "A rich pizza topped with four different cheeses: mozzarella, parmesan, cheddar, and blue cheese.",
    "ingredients": [
        "1 Pizza dough",
        "100g Tomato sauce",
        "50g Mozzarella cheese, shredded",
        "50g Parmesan cheese, grated",
        "50g Cheddar cheese, shredded",
        "50g Blue cheese, crumbled"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Roll out the pizza dough and spread a thin layer of tomato sauce. Sprinkle the four cheeses (mozzarella, parmesan, cheddar, and blue cheese) evenly over the sauce. Bake the pizza for 10-12 minutes until the crust is golden and the cheese is melted and bubbling. Serve hot and enjoy the rich, cheesy goodness.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/four_cheese_pizza.jpg"
},
{
    "id": 77,
    "name": "Mushroom and Truffle Pizza",
    "shortDisc": "A gourmet pizza with earthy mushrooms and aromatic truffle oil.",
    "ingredients": [
        "1 Pizza dough",
        "100g Olive oil",
        "150g Mushrooms, sliced",
        "100g Mozzarella cheese, shredded",
        "1 tbsp Truffle oil",
        "Fresh parsley for garnish"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Brush the pizza dough with olive oil. Evenly distribute the sliced mushrooms and shredded mozzarella cheese on the dough. Drizzle with truffle oil. Bake the pizza for 10-12 minutes, or until the crust is golden and the cheese is bubbling. Remove from the oven and garnish with fresh parsley before serving.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/mushroom_truffle_pizza.jpg"
},
{
    "id": 78,
    "name": "Buffalo Chicken Pizza",
    "shortDisc": "A spicy pizza topped with buffalo chicken, mozzarella, and a ranch dressing drizzle.",
    "ingredients": [
        "1 Pizza dough",
        "100g Buffalo sauce",
        "150g Grilled chicken, shredded",
        "150g Mozzarella cheese, shredded",
        "Ranch dressing for drizzling"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Toss the shredded grilled chicken in buffalo sauce. Roll out the pizza dough and spread the buffalo chicken evenly over it. Sprinkle the shredded mozzarella cheese on top. Bake for 10-12 minutes until the crust is golden and the cheese is melted. After baking, drizzle with ranch dressing before serving.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/buffalo_chicken_pizza.jpg"
},
{
    "id": 79,
    "name": "Pesto Chicken Pizza",
    "shortDisc": "A pizza topped with pesto sauce, grilled chicken, and mozzarella cheese.",
    "ingredients": [
        "1 Pizza dough",
        "100g Pesto sauce",
        "150g Grilled chicken, sliced",
        "150g Mozzarella cheese, shredded",
        "Sun-dried tomatoes for garnish"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Spread the pesto sauce evenly over the pizza dough. Add the grilled chicken slices and sprinkle the shredded mozzarella cheese over the top. Bake for 10-12 minutes until the crust is golden and the cheese is melted. Garnish with sun-dried tomatoes and serve hot.",
    "categories": ["main-course", "pizza"],
    "image": "assets/imgs/pesto_chicken_pizza.jpg"
},
{
    "id": 80,
    "name": "Seafood Pizza",
    "shortDisc": "A seafood lover's pizza topped with shrimp, calamari, and clams, with a garlic butter sauce.",
    "ingredients": [
        "1 Pizza dough",
        "100g Garlic butter sauce",
        "150g Shrimp, peeled",
        "100g Calamari, sliced",
        "100g Clams",
        "150g Mozzarella cheese, shredded"
    ],
    "preparation": "Preheat the oven to 220°C (430°F). Spread the garlic butter sauce evenly over the pizza dough. Add the shrimp, calamari, and clams, followed by the shredded mozzarella cheese. Bake for 10-12 minutes until the crust is golden and the cheese is melted. Remove from the oven and serve hot for a seafood indulgence.",
    "categories": ["main-course", "pizza", "seafood"],
    "image": "assets/imgs/seafood_pizza.jpg"
},
{
    "id": 81,
    "name": "Garlic Butter Shrimp",
    "shortDisc": "Succulent shrimp sautéed in a rich garlic butter sauce.",
    "ingredients": [
        "300g Shrimp, peeled and deveined",
        "4 tbsp Butter",
        "3 Garlic cloves, minced",
        "1 tbsp Lemon juice",
        "1/4 cup Fresh parsley, chopped",
        "Salt and pepper to taste"
    ],
    "preparation": "Melt butter in a large skillet over medium heat. Add the minced garlic and sauté until fragrant, about 1 minute. Add the shrimp to the skillet and cook, stirring occasionally, until they turn pink and opaque, about 3-4 minutes. Add lemon juice and stir to combine. Season with salt and pepper to taste, then sprinkle with fresh parsley. Serve immediately.",
    "categories": ["main-course", "seafood"],
    "image": "assets/imgs/garlic_butter_shrimp.jpg"
},
{
    "id": 82,
    "name": "Shrimp Scampi",
    "shortDisc": "Garlic and lemon shrimp served with pasta, perfect for a quick meal.",
    "ingredients": [
        "300g Shrimp, peeled and deveined",
        "3 Garlic cloves, minced",
        "1/4 cup Olive oil",
        "1/4 cup White wine",
        "Juice of 1 lemon",
        "200g Spaghetti",
        "Fresh parsley, chopped"
    ],
    "preparation": "Cook the spaghetti according to the package instructions, then drain and set aside, reserving some of the pasta water. In a large skillet, heat the olive oil over medium heat. Add the minced garlic and sauté until fragrant, about 1 minute. Add the shrimp and cook for 2-3 minutes until they turn pink and opaque. Add the white wine and lemon juice, stirring to combine. Allow the sauce to simmer for 2-3 minutes, then add the cooked pasta. Toss the pasta in the sauce, adding a bit of the reserved pasta water if needed to help coat the noodles. Sprinkle with fresh parsley and serve.",
    "categories": ["main-course", "seafood"],
    "image": "assets/imgs/shrimp_scampi.jpg"
},
{
    "id": 83,
    "name": "Lobster Tail",
    "shortDisc": "Baked lobster tail with butter and garlic, a decadent seafood treat.",
    "ingredients": [
        "2 Lobster tails",
        "1/4 cup Butter, melted",
        "2 Garlic cloves, minced",
        "1 tbsp Lemon juice",
        "Fresh parsley for garnish"
    ],
    "preparation": "Preheat your oven to 400°F (200°C). Using a sharp knife or kitchen shears, cut the lobster tails lengthwise, being careful not to cut all the way through. Gently pull the lobster meat out of the shell, keeping it attached at the base. Place the lobster tails on a baking sheet. In a small bowl, mix together the melted butter, minced garlic, and lemon juice. Brush the butter mixture generously over the lobster meat. Bake the lobster tails for 12-15 minutes, or until the meat is opaque and tender. Garnish with fresh parsley and serve immediately.",
    "categories": ["main-course", "seafood"],
    "image": "assets/imgs/lobster_tail.jpg"
},
{
    "id": 84,
    "name": "Classic American Burger",
    "shortDisc": "A juicy beef burger with melted cheese, fresh vegetables, and a toasted bun.",
    "ingredients": [
        "500g Ground beef (80% lean, 20% fat)",
        "1 tsp Salt",
        "1/2 tsp Black pepper",
        "4 Burger buns, toasted",
        "4 Slices of cheddar cheese",
        "1 Tomato, sliced",
        "1 Onion, sliced into rings",
        "4 Lettuce leaves",
        "Pickles (optional)",
        "Ketchup and mustard, for serving"
    ],
    "preparation": "In a bowl, mix the ground beef with salt and pepper. Divide into 4 equal portions and shape into patties, slightly larger than the buns. Heat a grill or skillet over medium-high heat. Cook the patties for 3-4 minutes on each side, adding a slice of cheese to each patty during the last minute of cooking to melt. Assemble the burger by layering the lettuce, tomato, onion, and the cooked patty on the bottom half of the toasted bun. Add ketchup, mustard, and pickles as desired. Top with the other half of the bun and serve immediately.",
    "categories": ["main-course", "american"],
    "image": "assets/imgs/classic_american_burger.jpg"
},
{
    "id": 85,
    "name": "Crab Cakes",
    "shortDisc": "Golden brown crab cakes with a crispy exterior and tender crab meat inside.",
    "ingredients": [
        "300g Crab meat",
        "1/2 cup Bread crumbs",
        "1 Egg",
        "2 tbsp Mayonnaise",
        "1 tbsp Dijon mustard",
        "1 tbsp Lemon juice",
        "1/2 tsp Old Bay seasoning",
        "Olive oil for frying"
    ],
    "preparation": "In a large bowl, combine the crab meat, breadcrumbs, egg, mayonnaise, Dijon mustard, lemon juice, and Old Bay seasoning. Gently mix until well combined. Shape the mixture into small patties. Heat olive oil in a frying pan over medium heat. Fry the crab cakes for 3-4 minutes on each side, or until golden brown and crispy. Remove from the pan and drain on paper towels. Serve warm.",
    "categories": ["main-course", "seafood"],
    "image": "assets/imgs/crab_cakes.jpg"
},
{
    "id": 91,
    "name": "Eggplant Parmesan",
    "shortDisc": "Crispy breaded eggplant slices layered with tangy marinara sauce and melted mozzarella cheese, creating a perfect blend of flavors.",
    "ingredients": [
        "2 Eggplants, sliced",
        "2 cups Bread crumbs",
        "1/2 cup Parmesan cheese, grated",
        "2 Eggs, beaten",
        "2 cups Marinara sauce",
        "1 cup Mozzarella cheese, shredded",
        "Olive oil for frying"
    ],
    "preparation": "Preheat the oven to 375°F (190°C). Set up a breading station by placing the beaten eggs in one bowl and mixing the bread crumbs and grated Parmesan cheese in another. Dip each eggplant slice into the egg, coating both sides, then dredge it in the bread crumb mixture. Heat olive oil in a large skillet over medium heat. Fry the eggplant slices in batches until golden brown and crispy, about 2-3 minutes per side. Remove the eggplant slices from the skillet and place them on a paper towel-lined plate to drain excess oil. In a baking dish, spread a thin layer of marinara sauce on the bottom. Layer the fried eggplant slices over the sauce, followed by a layer of marinara sauce and shredded mozzarella cheese. Repeat the layers until all eggplant slices are used, finishing with a layer of mozzarella cheese. Bake for 20-25 minutes, or until the cheese is melted and bubbly. Let it cool for a few minutes before serving.",
    "categories": ["vegetarian", "italian"],
    "image": "assets/imgs/eggplant_parmesan.jpg"
},
{
    "id": 92,
    "name": "Vegetable Stir Fry",
    "shortDisc": "A colorful mix of fresh vegetables stir-fried in a savory sauce, delivering a healthy and flavorful dish that's perfect for any meal.",
    "ingredients": [
        "1 Bell pepper, sliced",
        "1 Carrot, julienned",
        "1 Zucchini, sliced",
        "1/2 cup Snow peas",
        "2 tbsp Soy sauce",
        "1 tbsp Olive oil",
        "1 tsp Ginger, minced",
        "1 tbsp Sesame oil"
    ],
    "preparation": "Heat olive oil and sesame oil in a large skillet or wok over medium-high heat. Add the minced ginger and stir-fry for about 30 seconds, until fragrant. Add the bell pepper, carrot, zucchini, and snow peas to the skillet, and stir-fry for about 5-7 minutes, or until the vegetables are tender-crisp. Pour in the soy sauce and stir to combine, cooking for another 2-3 minutes. Taste and adjust seasoning if necessary, then serve hot over rice or noodles.",
    "categories": ["vegetarian", "asian"],
    "image": "assets/imgs/vegetable_stir_fry.jpg"
},
{
    "id": 93,
    "name": "Vegetarian Tacos",
    "shortDisc": "These tacos are packed with delicious and nutritious black beans, fresh avocado, and veggies, creating the perfect vegetarian meal full of flavor.",
    "ingredients": [
        "4 Soft tortillas",
        "1 can Black beans, drained",
        "1 Avocado, sliced",
        "1 Tomato, diced",
        "1/2 cup Lettuce, shredded",
        "1/4 cup Red onion, sliced",
        "Sour cream for topping"
    ],
    "preparation": "Warm the tortillas in a dry skillet or microwave. In a small pan, heat the black beans over medium heat until warmed through. To assemble the tacos, place a few spoonfuls of beans in each tortilla. Top with slices of avocado, diced tomato, shredded lettuce, and sliced red onion. Add a dollop of sour cream on top and serve with lime wedges on the side for extra flavor.",
    "categories": ["vegetarian", "mexican"],
    "image": "assets/imgs/vegetarian_tacos.jpg"
},
{
    "id": 94,
    "name": "Lentil Soup",
    "shortDisc": "A warm, hearty soup made with lentils and a variety of fresh vegetables, offering a delicious and nutritious meal perfect for any occasion.",
    "ingredients": [
        "1 cup Lentils",
        "1 Onion, chopped",
        "2 Carrots, chopped",
        "2 Celery stalks, chopped",
        "3 Garlic cloves, minced",
        "4 cups Vegetable broth",
        "1 tsp Cumin",
        "Salt and pepper to taste"
    ],
    "preparation": "In a large pot, heat a bit of olive oil over medium heat. Add the chopped onion, carrots, celery, and minced garlic, and sauté for about 5 minutes, until the vegetables are soft. Add the lentils, vegetable broth, and cumin to the pot. Stir to combine, bring to a boil, and then reduce the heat to low. Simmer for about 30 minutes, or until the lentils are tender. Season with salt and pepper to taste, and serve hot.",
    "categories": ["vegetarian", "soup"],
    "image": "assets/imgs/lentil_soup.jpg"
},
{
    "id": 95,
    "name": "Falafel",
    "shortDisc": "Crispy and golden brown chickpea patties flavored with a blend of fresh herbs and spices, perfect for a light meal or snack.",
    "ingredients": [
        "1 can Chickpeas, drained",
        "1 Onion, chopped",
        "2 Garlic cloves, minced",
        "1/4 cup Parsley, chopped",
        "1 tsp Cumin",
        "1/2 tsp Baking powder",
        "1/4 cup Flour",
        "Olive oil for frying"
    ],
    "preparation": "Drain the chickpeas and place them in a food processor along with the onion, garlic, parsley, cumin, baking powder, and flour. Pulse until the mixture is coarse but holds together. Form the mixture into small patties. Heat olive oil in a large skillet over medium heat and fry the patties in batches until golden and crispy on both sides, about 3-4 minutes per side. Remove from the skillet and drain on paper towels. Serve with tahini sauce or yogurt.",
    "categories": ["vegetarian", "middle-eastern"],
    "image": "assets/imgs/falafel.jpg"
},
{
    "id": 96,
    "name": "Vegetable Quiche",
    "shortDisc": "A savory quiche filled with eggs, cheese, and a colorful mix of vegetables, baked in a crispy pie crust for a delicious and satisfying meal.",
    "ingredients": [
        "1 Pie crust",
        "4 Eggs",
        "1/2 cup Heavy cream",
        "1/2 cup Cheese, shredded",
        "1/2 cup Spinach, chopped",
        "1/4 cup Onion, chopped",
        "Salt and pepper to taste"
    ],
    "preparation": "Preheat the oven to 375°F (190°C). In a large bowl, whisk together the eggs, heavy cream, shredded cheese, spinach, and chopped onion. Season with salt and pepper. Pour the mixture into the pie crust and spread it evenly. Bake for 30-35 minutes, or until the quiche is set and golden brown on top. Let it cool for a few minutes before slicing and serving.",
    "categories": ["vegetarian", "breakfast"],
    "image": "assets/imgs/vegetable_quiche.jpg"
},
{
    "id": 97,
    "name": "Chicken Shawarma",
    "shortDisc": "Marinated chicken grilled to perfection and served in warm pita bread with tahini sauce, offering a delicious Middle Eastern flavor experience.",
    "ingredients": [
        "4 Chicken breasts, boneless",
        "1/4 cup Olive oil",
        "1 tbsp Paprika",
        "1 tbsp Cumin",
        "1/2 tsp Turmeric",
        "2 Garlic cloves, minced",
        "Pita bread",
        "Tahini sauce"
    ],
    "preparation": "In a bowl, combine olive oil, paprika, cumin, turmeric, minced garlic, salt, and pepper. Rub the marinade onto the chicken breasts and let them sit for at least 30 minutes. Preheat the grill or a grill pan over medium heat. Grill the chicken for about 6-7 minutes per side, or until fully cooked. Slice the chicken thinly and serve in pita bread with a drizzle of tahini sauce and fresh vegetables.",
    "categories": ["main-course", "middle-eastern"],
    "image": "assets/imgs/chicken_shawarma.jpg"
},
{
    "id": 98,
    "name": "Beef Kebabs",
    "shortDisc": "Juicy beef cubes marinated in flavorful spices and grilled on skewers, served with rice for a mouthwatering Middle Eastern-inspired dish.",
    "ingredients": [
        "500g Beef cubes",
        "2 tbsp Olive oil",
        "1 tbsp Lemon juice",
        "1 tsp Cumin",
        "1 tsp Paprika",
        "Salt and pepper to taste",
        "Wooden skewers"
    ],
    "preparation": "In a bowl, combine olive oil, lemon juice, cumin, paprika, salt, and pepper. Add the beef cubes and toss to coat. Let the beef marinate for at least 30 minutes. Thread the beef onto wooden skewers and preheat the grill or grill pan to medium-high heat. Grill the kebabs for 8-10 minutes, turning occasionally, until the beef reaches your desired doneness. Serve with rice or flatbread.",
    "categories": ["main-course", "middle-eastern"],
    "image": "assets/imgs/beef_kebabs.jpg"
},
{
    "id": 99,
    "name": "Shakshuka",
    "shortDisc": "A savory dish of poached eggs in a rich tomato and bell pepper sauce, spiced with paprika and served with crusty bread for dipping.",
    "ingredients": [
        "4 Eggs",
        "1 Onion, chopped",
        "1 Bell pepper, chopped",
        "2 Garlic cloves, minced",
        "400g Tomatoes, diced",
        "1 tsp Paprika",
        "Olive oil for cooking"
    ],
    "preparation": "Heat olive oil in a large skillet over medium heat. Add the chopped onion, bell pepper, and minced garlic. Sauté for about 5 minutes, or until softened. Add the diced tomatoes and paprika, and cook for another 10 minutes, stirring occasionally, until the sauce thickens. Make four small wells in the sauce and crack an egg into each well. Cover the skillet and cook for about 5-7 minutes, or until the eggs are set. Serve with crusty bread.",
    "categories": ["breakfast", "middle-eastern"],
    "image": "assets/imgs/shakshuka.jpg"
},
{
    "id": 100,
    "name": "Greek Salad",
    "shortDisc": "A refreshing and vibrant salad with fresh vegetables, feta cheese, and a tangy olive oil dressing, perfect for any occasion.",
    "ingredients": [
        "2 Tomatoes, diced",
        "1 Cucumber, sliced",
        "1 Green bell pepper, sliced",
        "1 Red onion, thinly sliced",
        "150g Feta cheese, cubed",
        "1/4 cup Kalamata olives",
        "2 tbsp Olive oil",
        "1 tbsp Red wine vinegar",
        "1 tsp Dried oregano"
    ],
    "preparation": "In a large bowl, combine the diced tomatoes, sliced cucumber, green bell pepper, and red onion. Add the cubed feta cheese and Kalamata olives on top. Drizzle with olive oil and red wine vinegar. Sprinkle with dried oregano, and gently toss the salad to mix. Serve immediately or chill for 15 minutes before serving for enhanced flavors.",
    "categories": ["vegetarian", "Appetizer", "salad", "greek"],
    "image": "assets/imgs/greek_salad.jpg"
},
];

const commentsData = [
    {
        comment: "The recipes here are nothing short of brilliant. They capture the essence of true culinary art and make cooking an enjoyable, satisfying experience every time.",
        name: "Gordon Ramsay",
        title: "Michelin-Starred Chef"
    },
    {
        comment: "Innovative yet simple, these recipes offer great flavors and textures that are easy to prepare. A must-try for anyone looking to spice up their home cooking experience.",
        name: "Alice Waters",
        title: "Chef & Founder of Chez Panisse"
    },
    {
        comment: "A wonderful selection of dishes that perfectly balance creativity and simplicity. These recipes inspire anyone to elevate their home cooking to new heights of deliciousness.",
        name: "Wolfgang Puck",
        title: "Restaurateur & Chef"
    },
    {
        comment: "Cooking should always be about enjoyment and indulgence, and these recipes embody that spirit perfectly. They are rich in flavor, making every meal a celebration.",
        name: "Nigella Lawson",
        title: "TV Host & Cookbook Autho"
    },
    {
        comment: "These recipes are an absolute delight! They make cooking accessible and fun while delivering restaurant-quality meals in the comfort of your own home. Love it!",
        name: "Rachael Ray",
        title: "Chef & Media Personality"
    },
    {
        comment: "These recipes bring joy to the kitchen. Full of flavor and freshness, they are perfect for creating meals that bring people together and ignite your culinary passion.",
        name: "Jamie Oliver",
        title: "Founder of Jamie’s Italian"
    },
];