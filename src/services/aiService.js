import testOpenRouterAPI from '../utils/openRouterTest';

// Check if environment variables are properly loaded
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('OpenRouter API key is missing. Check your .env file and app initialization.');
}

export const getAIResponse = async (prompt, options = {}) => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please check your environment variables.');
  }

  try {
    console.log('Sending request to OpenRouter API...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://yourwebsite.com', // Required by OpenRouter
        'X-Title': 'Precision Baking' // Application name
      },
      body: JSON.stringify({
        model: options.model || 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful baking assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response format:', data);
      throw new Error('Received invalid response format from AI service');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with OpenRouter:', error);
    
    // Run test utility to diagnose issues
    console.log('Running diagnostic test...');
    const testResult = await testOpenRouterAPI();
    console.log('Diagnostic test result:', testResult);
    
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
};
