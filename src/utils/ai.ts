import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-v3-base:free';
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY; // Use React's environment variable

export async function queryAI(prompt: string): Promise<any> {
  if (!API_KEY) {
    console.error('API key is missing. Please set REACT_APP_OPENROUTER_API_KEY in your .env file.');
    return null;
  }

  // Check for nested quotes that might indicate a previous parsing attempt
  const cleanPrompt = prompt.replace(/Parse this input:\s*["'](.+?)["']/i, '$1');

  try {
    // Directly pass the input without quotes to avoid confusion
    const refinedPrompt = cleanPrompt;
    const messages = [
      {
        role: 'system',
        content: 'You are a precise ingredient parser. Extract the quantity, unit, and ingredient name from input text. Output ONLY valid JSON with keys "quantity" (number or null), "unit" (string or null), "ingredient" (string), and "details" (string). Make your best guess if uncertain. Never repeat instructions or include meta-text in your response.',
      },
      { role: 'user', content: `Extract ingredients from: ${refinedPrompt}` },
    ];

    const requestPayload = {
      model: MODEL,
      messages: messages,
      max_tokens: 100, // Increased token limit for complete responses
      temperature: 0.3, // Lower temperature for more deterministic responses
      response_format: { type: "json_object" }, // Request JSON format explicitly
    };

    console.log('Sending request to AI API:', requestPayload);

    const response = await axios.post(
      OPENROUTER_API_URL,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // Replace with your actual domain in production
          'X-Title': 'Precision Baking', // Optional application name
        },
      }
    );

    console.log('Received response from AI API:', response.data);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content.trim();
      
      try {
        // Try to parse the content as JSON
        const jsonContent = extractJsonFromText(content);
        
        // Check for instruction text in ANY field
        const hasInstructions = Object.values(jsonContent).some(value => 
          typeof value === 'string' && 
          (value.includes('Parse this input') || 
           value.includes('Extract') || 
           value.toLowerCase().includes('ingredients from'))
        );
        
        if (hasInstructions) {
          console.warn('AI returned instructions rather than parsed data:', jsonContent);
          return formatResponseAsText(createFallbackResponse(cleanPrompt)); // Format as text
        }
        
        // Check if we got an empty response
        if (!jsonContent.ingredient && !jsonContent.quantity && !jsonContent.unit) {
          // Create a fallback response with the original prompt as the ingredient
          return formatResponseAsText(createFallbackResponse(cleanPrompt)); // Format as text
        }
        
        // Format the output for better display
        const formattedContent = formatIngredientOutput(jsonContent);
        return formatResponseAsText(formattedContent); // Format as text
      } catch (jsonError) {
        console.error('Failed to parse AI response as JSON:', jsonError);
        console.log('Original content:', content);
        return formatResponseAsText(createFallbackResponse(cleanPrompt)); // Format as text
      }
    } else {
      console.warn('No valid response received from AI:', response.data);
      return formatResponseAsText(createFallbackResponse(cleanPrompt)); // Format as text
    }
  } catch (error: any) {
    if (error.response) {
      console.error('API responded with an error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from API:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return formatResponseAsText(createFallbackResponse(cleanPrompt)); // Format as text
  }
}

// Helper function to extract JSON from text (in case the AI includes additional text)
function extractJsonFromText(text: string): any {
  // Try to parse the content directly
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON if there's surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        // If still failing, return a default object
        return { quantity: null, unit: null, ingredient: null };
      }
    }
    throw new Error('Could not extract valid JSON');
  }
}

// Helper function to format ingredient output for better display and include details
function formatIngredientOutput(data: any): any {
  // Create a normalized copy of the data
  const formatted = { ...data };
  
  // Standardize unit names
  if (formatted.unit) {
    const unitMap: Record<string, string> = {
      'c': 'cups',
      'cup': 'cups',
      'tbsp': 'tablespoons',
      'tbs': 'tablespoons',
      'tbsps': 'tablespoons',
      'tablespoon': 'tablespoons',
      'tsp': 'teaspoons',
      'tsps': 'teaspoons',
      'teaspoon': 'teaspoons',
      'oz': 'ounces',
      'ounce': 'ounces',
      'lb': 'pounds',
      'lbs': 'pounds',
      'pound': 'pounds',
      'g': 'grams',
      'gram': 'grams',
      'kg': 'kilograms',
      'kilogram': 'kilograms',
      'ml': 'milliliters',
      'milliliter': 'milliliters',
      'l': 'liters',
      'liter': 'liters',
      'pt': 'pints',
      'pint': 'pints',
      'qt': 'quarts',
      'quart': 'quarts',
      'gal': 'gallons',
      'gallon': 'gallons'
    };
    
    formatted.unit = unitMap[formatted.unit.toLowerCase()] || formatted.unit.toLowerCase();
  }
  
  // Clean up ingredient name
  if (formatted.ingredient) {
    formatted.ingredient = formatted.ingredient.replace(/^of\s+/i, '').trim();
    formatted.ingredient = formatted.ingredient.charAt(0).toUpperCase() + formatted.ingredient.slice(1);
  }

  // Add a details property for equivalent weight in grams
  if (formatted.unit === 'cups' && formatted.ingredient.toLowerCase() === 'rice') {
    const gramsPerCup = 100.0; // Updated: 1 cup of rice = 100 grams
    formatted.details = `${formatted.quantity * gramsPerCup} grams`;
  } else {
    formatted.details = 'Equivalent weight not available';
  }

  // Remove the display property for simplicity
  delete formatted.display;

  return formatted;
}

// Helper function to create a fallback response when AI fails
function createFallbackResponse(originalInput: string): any {
  // Try to make a simple extraction based on common patterns
  let quantity: number | null = null;
  let unit: string | null = null;
  let ingredient: string = originalInput;
  
  // Simple regex to extract common measurement patterns
  const measurementRegex = /^([\d\/\.\s]+)\s*([a-zA-Z]+)\s+(?:of\s+)?(.+)$/i;
  const match = originalInput.match(measurementRegex);
  
  if (match) {
    // Try to convert the quantity part to a number
    try {
      // Handle fractions like 1/2
      if (match[1].includes('/')) {
        const fractionParts = match[1].split('/');
        if (fractionParts.length === 2) {
          quantity = parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]);
        }
      } else {
        quantity = parseFloat(match[1]);
      }
      
      unit = match[2].toLowerCase();
      ingredient = match[3];
    } catch (e) {
      // If parsing fails, keep the defaults
    }
  }
  
  // Capitalize the ingredient
  ingredient = ingredient.trim();
  if (ingredient) {
    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
  }
  
  // Create the details text
  let details = "";
  if (unit === 'cups' && ingredient.toLowerCase() === 'rice') {
    const gramsPerCup = 100.0; // Updated: 1 cup of rice = 100 grams
    details = `${quantity ? quantity * gramsPerCup : 'Unknown'} grams`;
  } else {
    details = 'Equivalent weight not available';
  }
  
  return {
    quantity,
    unit,
    ingredient,
    details
  };
}

// Helper function to format the response as plain text with better styling
function formatResponseAsText(data: any): string {
  return `📊 Ingredient Details 📊
━━━━━━━━━━━━━━━━━━━━━━━━
📏 Quantity: ${data.quantity !== null ? data.quantity : 'N/A'}
🏷️ Unit: ${data.unit || 'N/A'}
🍽️ Ingredient: ${data.ingredient || 'N/A'}
ℹ️ Details: ${data.details || 'N/A'}`;
}

// Alternative: If React rendering is the issue, return an array of strings with styling
function formatResponseAsArray(data: any): string[] {
  return [
    `📊 Ingredient Details 📊`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📏 Quantity: ${data.quantity !== null ? data.quantity : 'N/A'}`,
    `🏷️ Unit: ${data.unit || 'N/A'}`,
    `🍽️ Ingredient: ${data.ingredient || 'N/A'}`,
    `ℹ️ Details: ${data.details || 'N/A'}`,
  ];
}
