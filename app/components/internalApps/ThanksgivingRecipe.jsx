"use client"

import { useState, useEffect } from "react";

const ThanksgivingRecipe = () => {
  const [servings, setServings] = useState(4);
  const [recipes, setRecipes] = useState({
    mainCourse: {
      title: "Main Course",
      options: [
        {
          name: "Herb Butter Roasted Turkey",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Turkey", amount: 6, unit: "lbs", scalable: true, checked: false },
            { name: "Softened butter", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Garlic", amount: 2, unit: "garlic cloves", scalable: false, checked: false },
            { name: "Fresh herbs (thyme, sage, rosemary)", amount: 0.25, unit: "cup", scalable: true, checked: false }
          ],
          steps: [
            { name: "Combine softened butter with garlic and herbs", checked: false },
            { name: "Carefully rub butter mixture under turkey skin", checked: false },
            { name: "Roast at 325°F", checked: false },
            { name: "Baste every 45 minutes until done", checked: false }
          ]
        },
        {
          name: "Honey-Glazed Ham",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Ham", amount: 6, unit: "lbs", scalable: true, checked: false },
            { name: "Honey", amount: 0.5, unit: "cup", scalable: false, checked: false },
            { name: "Brown sugar", amount: 0.25, unit: "cup", scalable: false, checked: false },
            { name: "Dijon mustard", amount: 0.25, unit: "cup", scalable: false, checked: false }
          ],
          steps: [
            { name: "Mix honey, brown sugar, and Dijon for glaze", checked: false },
            { name: "Brush ham with glaze", checked: false },
            { name: "Bake at 325°F", checked: false },
            { name: "Baste every 20 minutes for about 2 hours", checked: false }
          ]
        }
      ]
    },
    sides: {
      title: "Side Dishes",
      options: [
        {
          name: "Classic Mashed Potatoes",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Yukon Gold potatoes", amount: 4, unit: "lbs", scalable: true, checked: false },
            { name: "Butter", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Heavy cream", amount: 1, unit: "cup", scalable: true, checked: false },
            { name: "Salt and pepper", amount: 2, unit: "tbsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Boil potatoes until tender", checked: false },
            { name: "Drain potatoes thoroughly", checked: false },
            { name: "Mash with butter and cream", checked: false },
            { name: "Season with salt and pepper to taste", checked: false }
          ]
        },
        {
          name: "Classic Bread Stuffing",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Bread cubes", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Onions and celery", amount: 2, unit: "cups", scalable: true, checked: false },
            { name: "Fresh herbs (sage, thyme, rosemary)", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Chicken broth", amount: 2, unit: "cups", scalable: true, checked: false }
          ],
          steps: [
            { name: "Sauté onions and celery until soft", checked: false },
            { name: "Mix with bread cubes and herbs", checked: false },
            { name: "Moisten with broth", checked: false },
            { name: "Bake at 350°F until golden", checked: false }
          ]
        },
        {
          name: "Classic Green Bean Casserole",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Fresh green beans", amount: 4, unit: "lbs", scalable: true, checked: false },
            { name: "Cream of mushroom soup", amount: 1, unit: "can", scalable: false, checked: false },
            { name: "Crispy fried onions", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Salt and pepper", amount: 2, unit: "tbsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Blanch green beans until tender-crisp", checked: false },
            { name: "Mix with mushroom soup", checked: false },
            { name: "Top with fried onions", checked: false },
            { name: "Bake at 350°F until bubbly", checked: false }
          ]
        },
        {
          name: "Simple Buttered Corn",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Corn kernels", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Butter", amount: 0.25, unit: "cup", scalable: true, checked: false },
            { name: "Salt", amount: 1, unit: "tsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Steam or boil corn until tender", checked: false },
            { name: "Drain corn if needed", checked: false }, 
            { name: "Add butter and salt", checked: false },
            { name: "Stir until butter is melted", checked: false }
          ]
        },
        {
          name: "Classic Mac and Cheese",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Elbow macaroni", amount: 1, unit: "lb", scalable: true, checked: false },
            { name: "Sharp cheddar cheese", amount: 3, unit: "cups", scalable: true, checked: false },
            { name: "Milk", amount: 2, unit: "cups", scalable: true, checked: false },
            { name: "Butter", amount: 0.25, unit: "cup", scalable: true, checked: false },
            { name: "All-purpose flour", amount: 0.25, unit: "cup", scalable: true, checked: false },
            { name: "Salt and pepper", amount: 1, unit: "tbsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Cook macaroni according to package directions", checked: false },
            { name: "Make cheese sauce with butter, flour, milk and cheese", checked: false },
            { name: "Combine sauce with cooked macaroni", checked: false },
            { name: "Bake at 350°F until bubbly and golden", checked: false }
          ]
        }
      ]
    },
    breads: {
      title: "Breads",
      options: [
        {
          name: "Classic Dinner Rolls",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Flour", amount: 2, unit: "cups", scalable: true, checked: false },
            { name: "Yeast", amount: 0.25, unit: "oz", scalable: false, checked: false },
            { name: "Butter", amount: 0.25, unit: "cup", scalable: true, checked: false },
            { name: "Salt", amount: 1, unit: "tsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Mix and knead dough", checked: false },
            { name: "Let rise until doubled", checked: false },
            { name: "Shape into rolls", checked: false },
            { name: "Bake at 375°F for 15-20 minutes", checked: false }
          ]
        },
        {
          name: "Buttermilk Biscuits",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "All-purpose flour", amount: 2, unit: "cups", scalable: true, checked: false },
            { name: "Buttermilk", amount: 1, unit: "cup", scalable: true, checked: false },
            { name: "Cold butter", amount: 0.25, unit: "cup", scalable: true, checked: false },
            { name: "Baking powder", amount: 1, unit: "tsp", scalable: false, checked: false },
            { name: "Salt", amount: 1, unit: "tsp", scalable: true, checked: false }
          ],
          steps: [
            { name: "Cut cold butter into flour mixture", checked: false },
            { name: "Add buttermilk and mix until just combined", checked: false },
            { name: "Pat and fold dough, cut into biscuits", checked: false },
            { name: "Bake at 425°F for 12-15 minutes", checked: false }
          ]
        }
      ]
    },
    desserts: {
      title: "Desserts", 
      options: [
        {
          name: "Classic Pumpkin Pie",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Canned pumpkin", amount: 1, unit: "can (15 oz)", scalable: false, checked: false },
            { name: "Sugar", amount: 0.75, unit: "cup", scalable: false, checked: false },
            { name: "Pumpkin pie spice", amount: 2.5, unit: "tsp", scalable: false, checked: false },
            { name: "Eggs", amount: 2, unit: "large eggs", scalable: false, checked: false },
            { name: "Evaporated milk", amount: 1, unit: "can (12 oz)", scalable: false, checked: false },
            { name: "Pie crust", amount: 1, unit: "pie crust", scalable: false, checked: false }
          ],
          steps: [
            { name: "Mix pumpkin with sugar and spices", checked: false },
            { name: "Beat in eggs until smooth", checked: false },
            { name: "Pour into pie crust", checked: false },
            { name: "Bake at 350°F until set", checked: false }
          ]
        },
        {
          name: "Apple Pie",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Apples", amount: 8, unit: "medium apples", scalable: true, checked: false },
            { name: "Sugar", amount: 0.75, unit: "cup", scalable: false, checked: false },
            { name: "Cinnamon", amount: 2, unit: "tsp", scalable: false, checked: false },
            { name: "Butter", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Pie crust", amount: 1, unit: "pie crust", scalable: false, checked: false }
          ],
          steps: [
            { name: "Slice apples and mix with sugar and cinnamon", checked: false },
            { name: "Layer apples in pie crust", checked: false },
            { name: "Dot with butter and add top crust", checked: false },
            { name: "Bake at 375°F for 45-50 minutes", checked: false }
          ]
        },
        {
          name: "Pecan Pie",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Pecans", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Corn syrup", amount: 0.75, unit: "cup", scalable: false, checked: false },
            { name: "Eggs", amount: 4, unit: "eggs", scalable: false, checked: false },
            { name: "Butter", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Pie crust", amount: 1, unit: "pie crust", scalable: false, checked: false }
          ],
          steps: [
            { name: "Mix corn syrup, eggs, and butter", checked: false },
            { name: "Stir in pecans", checked: false },
            { name: "Pour into pie crust", checked: false },
            { name: "Bake at 350°F for 60-70 minutes", checked: false }
          ]
        }
      ]
    },
    beverages: {
      title: "Beverages",
      options: [
        {
          name: "Spiced Apple Cider",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Apple cider", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Cinnamon sticks", amount: 2, unit: "whole sticks", scalable: false, checked: false },
            { name: "Whole cloves", amount: 6, unit: "whole cloves", scalable: false, checked: false },
            { name: "Orange", amount: 1, unit: "orange, sliced", scalable: false, checked: false }
          ],
          steps: [
            { name: "Combine all ingredients in pot", checked: false },
            { name: "Bring to simmer", checked: false },
            { name: "Reduce heat and steep 20 minutes", checked: false },
            { name: "Serve warm", checked: false }
          ]
        },
        {
          name: "Mulled Wine",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Red wine", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Orange", amount: 1, unit: "orange", scalable: false, checked: false },
            { name: "Cinnamon sticks", amount: 2, unit: "whole sticks", scalable: false, checked: false },
            { name: "Star anise", amount: 2, unit: "whole stars", scalable: false, checked: false },
            { name: "Honey", amount: 0.25, unit: "cup", scalable: false, checked: false }
          ],
          steps: [
            { name: "Combine wine and spices in pot", checked: false },
            { name: "Heat gently (do not boil)", checked: false },
            { name: "Simmer for 15-20 minutes", checked: false },
            { name: "Strain and serve warm", checked: false }
          ]
        },
        {
          name: "Cranberry Punch",
          selected: false,
          expanded: false,
          baseServings: 4,
          ingredients: [
            { name: "Cranberry juice", amount: 4, unit: "cups", scalable: true, checked: false },
            { name: "Sparkling apple cider", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Orange juice", amount: 0.5, unit: "cup", scalable: true, checked: false },
            { name: "Fresh cranberries for garnish", amount: 0.5, unit: "cup", scalable: false, checked: false }
          ],
          steps: [
            { name: "Mix juices in punch bowl", checked: false },
            { name: "Add sparkling cider just before serving", checked: false },
            { name: "Float cranberries on top", checked: false },
            { name: "Serve chilled", checked: false }
          ]
        }
      ]
    }
  });

  useEffect(() => {
    const savedRecipes = localStorage.getItem('thanksgivingRecipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  const toggleItem = (category, recipeIndex, type, itemIndex) => {
    const newRecipes = {...recipes};
    newRecipes[category].options[recipeIndex][type][itemIndex].checked = 
      !newRecipes[category].options[recipeIndex][type][itemIndex].checked;
    setRecipes(newRecipes);
    localStorage.setItem('thanksgivingRecipes', JSON.stringify(newRecipes));
  };

  const toggleRecipeSelection = (category, index) => {
    const newRecipes = {...recipes};
    newRecipes[category].options[index].selected = !newRecipes[category].options[index].selected;
    // Also toggle expansion when selected
    newRecipes[category].options[index].expanded = newRecipes[category].options[index].selected;
    setRecipes(newRecipes);
    localStorage.setItem('thanksgivingRecipes', JSON.stringify(newRecipes));
  };

  const toggleRecipeExpansion = (category, index) => {
    const newRecipes = {...recipes};
    newRecipes[category].options[index].expanded = !newRecipes[category].options[index].expanded;
    setRecipes(newRecipes);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Thanksgiving Recipe Planner</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <label className="block mb-2 font-medium">Number of Servings: {servings}</label>
        <input
          type="range"
          min="1"
          max="16"
          value={servings}
          onChange={(e) => setServings(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1</span>
          <span>16</span>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.keys(recipes).map((category) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{recipes[category].title}</h2>
            
            {recipes[category].options.map((recipe, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={recipe.selected}
                    onChange={() => toggleRecipeSelection(category, index)}
                    className="h-5 w-5"
                  />
                  <button 
                    onClick={() => toggleRecipeExpansion(category, index)}
                    className="text-left font-medium hover:text-blue-600"
                  >
                    {recipe.name}
                  </button>
                </div>

                {recipe.expanded && recipe.selected && (
                  <div className="ml-8 mt-4">
                    <h3 className="font-medium mb-2">Ingredients:</h3>
                    <ul className="mb-4">
                      {recipe.ingredients.map((item, idx) => (
                        <li key={idx} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(category, index, 'ingredients', idx)}
                            className="mr-3 h-4 w-4"
                          />
                          <span className={item.checked ? "line-through text-gray-500" : ""}>
                            {item.scalable 
                              ? `${(item.amount * (servings / recipe.baseServings)).toFixed(2)} ${item.unit} ${item.name}`
                              : item.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-medium mb-2">Steps:</h3>
                    <ul>
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={step.checked}
                            onChange={() => toggleItem(category, index, 'steps', idx)}
                            className="mr-3 h-4 w-4"
                          />
                          <span className={step.checked ? "line-through text-gray-500" : ""}>
                            {step.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
        <p className="text-lg mb-2">Need ingredients delivered?</p>
        <a 
          href="https://inst.cr/t/a5e1e77f0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 font-semibold"
        >
          Use my Instacart referral link to get $40 off your first two orders! →
        </a>
      </div>
    </div>
  );
};

export default ThanksgivingRecipe;
