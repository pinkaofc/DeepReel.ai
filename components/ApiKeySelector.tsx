
import React, { useState } from 'react';
import { setApiKey } from '../services/apiKeyStore';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [manualApiKey, setManualApiKey] = useState('');

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        onKeySelected();
      } catch (error) {
        console.error("Error opening API key selection:", error);
      }
    } else {
      console.error("aistudio context not found.");
    }
  };

  const handleUseManualKey = () => {
    const trimmedKey = manualApiKey.trim();
    if (trimmedKey) {
        setApiKey(trimmedKey);
        onKeySelected();
    }
  };

  return (
    <div className="mt-8 text-center bg-slate-800 p-8 rounded-xl border border-indigo-800 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-200">API Key Required</h2>
      <p className="mt-3 text-slate-400 max-w-md mx-auto">
        Video generation with Veo requires an API key. Please select one using the button below or paste your own.
      </p>
      <p className="mt-2 text-xs text-slate-500">
        For information about billing, please visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">ai.google.dev/gemini-api/docs/billing</a>.
      </p>
      <div className="mt-6">
        <button
          onClick={handleSelectKey}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full text-base shadow-lg transform transition-transform hover:scale-105"
        >
          Select Your API Key
        </button>
      </div>

      <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-700"></div>
      </div>

      <div>
        <label htmlFor="manual-key-input" className="text-slate-400 mb-3 block">Paste your API key here:</label>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <input 
                id="manual-key-input"
                type="password"
                value={manualApiKey}
                onChange={(e) => setManualApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 w-full max-w-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-200"
            />
            <button
                onClick={handleUseManualKey}
                disabled={!manualApiKey.trim()}
                className="bg-slate-600 w-full sm:w-auto hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Use Key
            </button>
        </div>
      </div>
    </div>
  );
};
