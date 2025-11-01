
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-xl shadow-lg mt-8">
      <div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-700 rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-semibold text-slate-300">
        {message}
      </p>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        High-quality video generation can take a few minutes. Please keep this window open.
      </p>
    </div>
  );
};
