// Simple test utility to verify OpenRouter API connectivity

const testOpenRouterAPI = async () => {
  const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  
  console.log('Testing OpenRouter API connection...');
  console.log('API Key (first 5 chars):', API_KEY?.substring(0, 5) || 'Not found');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Precision Baking',
        // Add OpenRouter required headers
        'User-Agent': 'PrecisionBakingApp/1.0',
        'Origin': window.location.origin || 'https://precision-baking.app'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Simple test: Say hello' }
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: false  // Explicitly disable streaming
      })
    });

    console.log('Response received:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
        console.error('API Error Details:', errorData);
      } catch (jsonError) {
        const textError = await response.text();
        errorDetail = textError;
        console.error('API Error Text:', textError);
      }
      
      return {
        success: false,
        status: response.status,
        message: `API Error: ${response.status} ${response.statusText}`,
        details: errorDetail
      };
    }

    const data = await response.json();
    console.log('API Test Success:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('API Connection Error:', error.message);
    return {
      success: false,
      message: `Connection Error: ${error.message}`
    };
  }
};

export default testOpenRouterAPI;
