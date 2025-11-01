
export type Language = 'english' | 'hindi';
export type VoiceTone = 'Motivational' | 'Calm' | 'Storyteller' | 'Deep' | 'Friendly';

export interface ReelResult {
  videoUrl: string;
  audioUrl: string;
  musicDescription: string;
  subtitles: string;
}

export interface SampleScript {
  title: string;
  script: string;
}
