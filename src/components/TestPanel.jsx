import React, { useState } from 'react';
import testOpenRouterAPI from '../utils/openRouterTest';
import testWithHardcodedKey from '../utils/hardcodedTest';

const TestPanel = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState('env');

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const testResult = testType === 'env' 
        ? await testOpenRouterAPI() 
        : await testWithHardcodedKey();
      
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px', maxWidth: '800px' }}>
      <h3>OpenRouter API Test Panel</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input 
            type="radio" 
            name="testType" 
            value="env" 
            checked={testType === 'env'} 
            onChange={() => setTestType('env')}
          /> 
          Test with .env API Key
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input 
            type="radio" 
            name="testType" 
            value="hardcoded" 
            checked={testType === 'hardcoded'} 
            onChange={() => setTestType('hardcoded')} 
          /> 
          Test with hardcoded API Key
        </label>
      </div>
      
      <button 
        onClick={runTest} 
        disabled={loading}
        style={{ padding: '8px 16px', cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Testing...' : 'Run API Test'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: result.success ? 'green' : 'red' }}>
            Test {result.success ? 'Succeeded' : 'Failed'}
          </h4>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPanel;
