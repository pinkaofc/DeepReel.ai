import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptEditor } from './components/ScriptEditor';
import { ResultViewer } from './components/ResultViewer';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ApiKeySelector } from './components/ApiKeySelector';
import type { Language, VoiceTone, ReelResult } from './types';
import { generateReel } from './services/geminiService';
import { SAMPLE_SCRIPTS } from './constants';

// Fix: Removed conflicting global declaration for window.aistudio to resolve type errors.
// This assumes the type is provided globally by the execution environment.

const App: React.FC = () => {
  const [script, setScript] = useState<string>(SAMPLE_SCRIPTS[0].script);
  const [language, setLanguage] = useState<Language>('english');
  const [voiceTone, setVoiceTone] = useState<VoiceTone>('Motivational');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReelResult | null>(null);

  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);
  
  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      await generateReel(
        script,
        language,
        voiceTone,
        setLoadingMessage,
        (newResult) => {
          setResult(newResult);
          setIsLoading(false);
        },
        (errorMessage) => {
            if (errorMessage.includes("Requested entity was not found")) {
                setError("API Key error. Please re-select your API key.");
                setApiKeySelected(false);
            } else {
                setError(errorMessage);
            }
            setIsLoading(false);
        }
      );
    } catch (e) {
      const error = e as Error;
      setError(error.message || 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [script, language, voiceTone]);

  const handleApiKeySelected = () => {
    setApiKeySelected(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {!result && !isLoading && (
            <ScriptEditor
              script={script}
              setScript={setScript}
              language={language}
              setLanguage={setLanguage}
              voiceTone={voiceTone}
              setVoiceTone={setVoiceTone}
            />
          )}

          {isLoading ? (
            <LoadingIndicator message={loadingMessage} />
          ) : result ? (
            <ResultViewer 
              result={result} 
              onReset={() => {
                setResult(null);
                setScript(SAMPLE_SCRIPTS[0].script);
              }}
            />
          ) : apiKeySelected ? (
             <div className="mt-8 flex justify-center">
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !script.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition-transform hover:scale-105"
              >
                {isLoading ? 'Generating...' : '✨ Generate DeepReel'}
              </button>
            </div>
          ) : (
            <ApiKeySelector onKeySelected={handleApiKeySelected} />
          )}

          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
