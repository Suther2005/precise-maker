import React, { useState } from 'react';
import { queryAI } from '../utils/ai'; // Adjusted path to match the correct location of queryAI

const RecipeForm: React.FC = () => {
  const [ingredientInput, setIngredientInput] = useState<string>(''); // State for ingredient input
  const [aiResponse, setAiResponse] = useState<string | null>(null); // State for AI response
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  // Function to handle AI query
  const handleQueryAI = async () => {
    if (!ingredientInput || ingredientInput.trim() === '') {
      setError('Ingredient input cannot be empty.');
      setAiResponse(null);
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      setError(null); // Clear previous errors
      const response = await queryAI(ingredientInput);

      if (response) {
        console.log('Raw AI Response:', response); // Debug log
        try {
          const parsedResponse = JSON.parse(response);
          setAiResponse(JSON.stringify(parsedResponse, null, 2)); // Format JSON for display
        } catch (parseError) {
          console.error('Failed to parse AI response as JSON:', response, parseError);
          setAiResponse(response); // Display raw response if JSON parsing fails
          setError(`Failed to parse AI response as JSON: ${(parseError as Error).message}. Displaying raw output.`);
        }
      } else {
        setAiResponse(null);
        setError('No response received from AI.');
      }
    } catch (aiError: any) {
      console.error('Error querying AI:', aiError);
      setAiResponse(null);
      setError(`Error querying AI: ${aiError.message}. Check console for details.`);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // JSX for input and response display
  return (
    <div>
      <input
        type="text"
        value={ingredientInput}
        onChange={(e) => setIngredientInput(e.target.value)} // Update ingredientInput state
        placeholder="Enter ingredient details"
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <button
        onClick={handleQueryAI}
        disabled={loading} // Disable button while loading
        style={{ padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {loading && <div style={{ color: 'blue', marginTop: '10px' }}>Loading...</div>}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {aiResponse && (
        <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <strong>AI Response:</strong>
          <pre>{aiResponse}</pre>
        </div>
      )}
    </div> // Ensure this div is properly closed
  );
};

export default RecipeForm;
