import React, { useState } from 'react';
import './App.css';
import { api_user, api_secret } from './secrets'

function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState('');

  const apiUrl = 'https://api.sightengine.com/1.0/check.json';
  // const apiUser = process.env.SE_API_USER; // Replace with your actual API user
  // const apiSecret = process.env.SE_API_SECRET; // Replace with your actual API secret
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleLoadImage = async () => {
    setImageSource(inputValue);
    const response = await fetch(
      `${apiUrl}?models=genai&api_user=${api_user}&api_secret=${api_secret}&url=${encodeURIComponent(
        inputValue as string // Type assertion as we've checked it's not null or empty
      )}`
    );
    // setAiConfidence(JSON.stringify(await response.json()))
    let percentage = (await response.json()).type.ai_generated * 100
    let message = `AI generated confidence: ${Number(percentage).toString()} %`
    setAiConfidence(message)
  };

  return (
    <div className="App">
      <h1>Image Viewer</h1>
      <div>
        <label htmlFor="imageInput">Filename or URI:</label>
        <input
          type="text"
          id="imageInput"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter filename or URL"
        />
        <button onClick={handleLoadImage}>Load Image</button>
      </div>
      {imageSource && (
        <div style={{ marginTop: '20px' }}>
          <h2>Preview</h2>
          <img
            src={imageSource}
            alt="Source for AI content test"
            style={{ maxWidth: '500px', maxHeight: '500px' }}
          />
        </div>
      )}
      <h3 id='confidence'>{aiConfidence}
      </h3>
    </div>
  );
}

export default App;