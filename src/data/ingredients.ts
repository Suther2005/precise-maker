export interface IngredientData {
  density: {
    cup: number;
    tablespoon: number;
    teaspoon: number;
    ounce: number;
    pinch: number;
  };
  alternatives: string[];
}

export const ingredientDatabase: Record<string, IngredientData> = {
  "all-purpose flour": {
    density: {
      cup: 120,
      tablespoon: 7.5,
      teaspoon: 2.5,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["plain flour", "white flour"]
  },
  "bread flour": {
    density: {
      cup: 130,
      tablespoon: 8.1,
      teaspoon: 2.7,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["strong flour", "high-gluten flour"]
  },
  "cake flour": {
    density: {
      cup: 110,
      tablespoon: 6.9,
      teaspoon: 2.3,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["pastry flour", "soft flour"]
  },
  "granulated sugar": {
    density: {
      cup: 200,
      tablespoon: 12.5,
      teaspoon: 4.2,
      ounce: 28.35,
      pinch: 0.8
    },
    alternatives: ["white sugar", "table sugar"]
  },
  "brown sugar": {
    density: {
      cup: 220,
      tablespoon: 13.8,
      teaspoon: 4.6,
      ounce: 28.35,
      pinch: 0.9
    },
    alternatives: ["light brown sugar", "dark brown sugar"]
  },
  "powdered sugar": {
    density: {
      cup: 120,
      tablespoon: 7.5,
      teaspoon: 2.5,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["confectioners' sugar", "icing sugar"]
  },
  "butter": {
    density: {
      cup: 227,
      tablespoon: 14.2,
      teaspoon: 4.7,
      ounce: 28.35,
      pinch: 1.0
    },
    alternatives: ["unsalted butter", "salted butter"]
  },
  "salt": {
    density: {
      cup: 288,
      tablespoon: 18,
      teaspoon: 6,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["table salt", "kosher salt", "sea salt"]
  },
  "milk": {
    density: {
      cup: 240,
      tablespoon: 15,
      teaspoon: 5,
      ounce: 28.35,
      pinch: 0.4
    },
    alternatives: ["whole milk", "skim milk", "2% milk"]
  },
  "honey": {
    density: {
      cup: 340,
      tablespoon: 21.3,
      teaspoon: 7.1,
      ounce: 28.35,
      pinch: 1.5
    },
    alternatives: ["raw honey", "liquid honey"]
  },
  "vegetable oil": {
    density: {
      cup: 224,
      tablespoon: 14,
      teaspoon: 4.7,
      ounce: 28.35,
      pinch: 1.0
    },
    alternatives: ["canola oil", "sunflower oil", "corn oil"]
  },
  "cocoa powder": {
    density: {
      cup: 100,
      tablespoon: 6.3,
      teaspoon: 2.1,
      ounce: 28.35,
      pinch: 0.5
    },
    alternatives: ["dutch-processed cocoa", "unsweetened cocoa"]
  }
};
