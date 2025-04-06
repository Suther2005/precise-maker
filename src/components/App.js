import React, { useState } from 'react';
import { getAIResponse } from '../services/aiService';
import testOpenRouterAPI from '../utils/openRouterTest';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testAPIConnection = async () => {
    try {
      setIsLoading(true);
      const testResult = await testOpenRouterAPI();
      console.log('API Test Result:', testResult);
      alert(testResult.success ? 
        'API connection successful!' : 
        `API connection failed: ${testResult.message}`);
    } catch (error) {
      console.error('Test failed:', error);
      alert(`Test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to Precision Baking</h1>
      <button 
        onClick={testAPIConnection} 
        style={{ margin: '10px', padding: '5px 10px' }}
      >
        Test AI Connection
      </button>
    </div>
  );
};

export default App;