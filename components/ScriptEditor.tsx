
import React, { useState } from 'react';
import type { Language, VoiceTone } from '../types';
import { SAMPLE_SCRIPTS, LANGUAGE_OPTIONS, VOICE_TONE_OPTIONS } from '../constants';

interface ScriptEditorProps {
  script: string;
  setScript: (script: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  voiceTone: VoiceTone;
  setVoiceTone: (tone: VoiceTone) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  setScript,
  language,
  setLanguage,
  voiceTone,
  setVoiceTone,
}) => {
  const [sampleIndex, setSampleIndex] = useState(0);

  const handleInspireMe = () => {
    const nextIndex = (sampleIndex + 1) % SAMPLE_SCRIPTS.length;
    setScript(SAMPLE_SCRIPTS[nextIndex].script);
    setSampleIndex(nextIndex);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="script" className="block text-lg font-semibold text-slate-300">
            Your Script
          </label>
          <button
            onClick={handleInspireMe}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Get Inspired ✨
          </button>
        </div>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your script here (e.g., 50-200 words)"
          className="w-full h-48 p-4 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-200 resize-none"
        />
        <p className="text-xs text-slate-500 mt-2 text-right">{script.split(/\s+/).filter(Boolean).length} words</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-slate-300 mb-2">
            Audio Language
          </label>
          <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setLanguage(option.value)}
                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                  language === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="voice-tone" className="block text-lg font-semibold text-slate-300 mb-2">
            Voice-over Tone
          </label>
          <div className="relative">
            <select
              id="voice-tone"
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value as VoiceTone)}
              className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-200"
            >
              {VOICE_TONE_OPTIONS.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
