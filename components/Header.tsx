
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        DeepReel.ai
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Transform Your Scripts into Cinematic Short-Form Videos
      </p>
    </header>
  );
};
