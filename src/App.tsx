import React, { useState, useEffect } from 'react';
import { calculateGrams, parseNaturalLanguageInput } from './utils/conversion';
import { queryAI } from './utils/ai'; // Import the AI utility
import { ingredientDatabase } from './data/ingredients';
import './App.css';

function App() {
  const [ingredient, setIngredient] = useState('');
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState('cup');
  const [result, setResult] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [conversionHistory, setConversionHistory] = useState<Array<{ingredient: string, amount: number, unit: string, result: number}>>([]);
  const [scaleAmount, setScaleAmount] = useState<number>(1);
  const [naturalInput, setNaturalInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null); // Store AI response

  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      setConversionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]);

  const handleConvert = () => {
    const grams = calculateGrams(ingredient, amount, unit);
    setResult(grams);

    if (grams > 0) {
      const newEntry = { ingredient, amount, unit, result: grams };
      setConversionHistory(prev => [newEntry, ...prev.slice(0, 9)]);
    }
  };

  const handleNaturalLanguageConvert = () => {
    if (!naturalInput.trim()) return;

    const parsed = parseNaturalLanguageInput(naturalInput);
    if (parsed) {
      setIngredient(parsed.ingredient);
      setAmount(parsed.amount);
      setUnit(parsed.unit);

      const grams = calculateGrams(parsed.ingredient, parsed.amount, parsed.unit);
      setResult(grams);

      if (grams > 0) {
        const newEntry = { 
          ingredient: parsed.ingredient, 
          amount: parsed.amount, 
          unit: parsed.unit, 
          result: grams 
        };
        setConversionHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      }
    }
  };

  const handleAIQuery = async () => {
    if (!naturalInput.trim()) return;

    const response = await queryAI(`Parse this input: "${naturalInput}"`);
    setAiResponse(response);

    if (response) {
      const parsed = parseNaturalLanguageInput(response);
      if (parsed) {
        setIngredient(parsed.ingredient);
        setAmount(parsed.amount);
        setUnit(parsed.unit);

        const grams = calculateGrams(parsed.ingredient, parsed.amount, parsed.unit);
        setResult(grams);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Precision Baking</h1>
          <p className="text-lg">Convert vague baking measurements to precise gram weights</p>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`mt-4 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'}`}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Natural Language Input with AI</h2>
          <div className="flex">
            <input
              type="text"
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              className="flex-grow p-3 border rounded-l-md bg-opacity-90 text-gray-900"
              placeholder="Try: 2 cups of flour"
            />
            <button
              onClick={handleAIQuery}
              className="px-4 rounded-r-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Ask AI
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 border rounded-md bg-gray-100 text-gray-900">
              <p className="font-medium">AI Response:</p>
              <p>{aiResponse}</p>
            </div>
          )}
        </div>

        <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ingredient</label>
            <input
              type="text"
              list="ingredients"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="w-full p-3 border rounded-md bg-opacity-90 text-gray-900"
              placeholder="Type an ingredient..."
            />
            <datalist id="ingredients">
              {Object.keys(ingredientDatabase).map((ing) => (
                <option key={ing} value={ing} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Amount</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full p-3 border rounded-md bg-opacity-90 text-gray-900"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-3 border rounded-md bg-opacity-90 text-gray-900"
              >
                <option value="cup">Cup</option>
                <option value="tablespoon">Tablespoon</option>
                <option value="teaspoon">Teaspoon</option>
                <option value="ounce">Ounce</option>
                <option value="pinch">Pinch</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Convert to Grams
          </button>

          {result !== null && (
            <div className="mt-6 p-4 border rounded-md text-center">
              <p className="text-lg">
                {amount} {unit}{amount !== 1 ? 's' : ''} of {ingredient} =
              </p>
              <p className="text-3xl font-bold mt-2">{result.toFixed(1)} grams</p>
              
              <div className="mt-4">
                <label className="block mb-2 font-medium text-sm">Scale recipe:</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setScaleAmount(prev => Math.max(0.25, prev - 0.25))}
                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={scaleAmount}
                    onChange={(e) => setScaleAmount(Math.max(0.25, parseFloat(e.target.value) || 1))}
                    className="w-16 text-center p-1 border-t border-b text-gray-900"
                  />
                  <button 
                    onClick={() => setScaleAmount(prev => prev + 0.25)}
                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-r"
                  >
                    +
                  </button>
                </div>
                <p className="mt-2">
                  Scaled amount: <strong>{(result * scaleAmount).toFixed(1)} grams</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {conversionHistory.length > 0 && (
          <div className={`max-w-md mx-auto mt-8 p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Recent Conversions</h2>
            <ul className="divide-y divide-gray-200">
              {conversionHistory.map((entry, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <span>
                    {entry.amount} {entry.unit}{entry.amount !== 1 ? 's' : ''} of {entry.ingredient}
                  </span>
                  <span className="font-bold">
                    {entry.result.toFixed(1)}g
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
