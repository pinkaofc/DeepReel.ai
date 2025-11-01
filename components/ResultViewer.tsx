
import React, { useRef, useState, useEffect } from 'react';
import type { ReelResult } from '../types';

interface ResultViewerProps {
  result: ReelResult;
  onReset: () => void;
}

const PlayIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
);

const PauseIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
);


export const ResultViewer: React.FC<ResultViewerProps> = ({ result, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }
  }, []);


  const handlePlayPause = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video && audio) {
      if (video.paused) {
        video.play();
        audio.currentTime = video.currentTime;
        audio.play();
      } else {
        video.pause();
        audio.pause();
      }
    }
  };
  
  const handleSeek = () => {
      if (videoRef.current && audioRef.current) {
          audioRef.current.currentTime = videoRef.current.currentTime;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/3 lg:w-[300px] mx-auto">
           <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700">
                <video
                    ref={videoRef}
                    src={result.videoUrl}
                    loop
                    muted
                    onSeeked={handleSeek}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <button onClick={handlePlayPause} className="text-white bg-black bg-opacity-50 rounded-full p-4">
                       {isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-center text-lg whitespace-pre-wrap leading-tight shadow-text" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                        {result.subtitles}
                    </p>
                </div>
                <audio ref={audioRef} src={result.audioUrl} />
            </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-indigo-400 mb-3">Generated Assets</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-300">🎵 Music Concept</h4>
                <p className="text-slate-400 text-sm mt-1">{result.musicDescription}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-300">🎤 Voice-over</h4>
                 <audio controls src={result.audioUrl} className="w-full mt-2 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
        >
          Create Another Reel
        </button>
      </div>
    </div>
  );
};
