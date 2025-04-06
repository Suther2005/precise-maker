/**
 * IMPORTANT: This file is for debugging purposes only.
 * Delete or comment out the API key after debugging is complete.
 */

const testWithHardcodedKey = async () => {
  // This is just for testing - should match your .env value
  const HARDCODED_KEY = "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";
  
  console.log('Testing with hardcoded key...');
  console.log('Using key (first 5):', HARDCODED_KEY.substring(0, 5));
  
  try {
    const startTime = Date.now();
    console.log('Sending request at:', new Date().toISOString());
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HARDCODED_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://precision-baking.app',
        'X-Title': 'Precision Baking'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3-base:free',
        messages: [
          { role: 'user', content: 'Say hello in one short sentence' }
        ],
        temperature: 0.2,
        max_tokens: 50,
        stream: false
      })
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`Response received after ${responseTime}ms:`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return {
        success: false,
        status: response.status,
        message: response.statusText,
        responseTime,
        error: errorText
      };
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    return {
      success: true,
      data,
      responseTime
    };
  } catch (error) {
    console.error('Test failed with exception:', error);
    return {
      success: false,
      message: error.message,
      stack: error.stack
    };
  }
};

export default testWithHardcodedKey;
