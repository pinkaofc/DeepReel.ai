
import type { SampleScript, VoiceTone, Language } from './types';

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    title: "The Two Wolves",
    script: "Tumhare andar do bhediye hain. Ek hai darr, gussa, aur afsos. Dusra hai himmat, pyaar, aur umeed. (You have two wolves inside you. One is fear, anger, and regret. The other is courage, love, and hope.) The one that wins? Jisko tum khilaate ho. (The one you feed.) Choose wisely."
  },
  {
    title: "The Unseen Effort",
    script: "They only see the trophy. They don't see the 5 AM alarms. They don't see the failures, the doubts, the hundreds of 'no's. They don't see the sacrifice. The world celebrates the result, but the journey... the journey is what builds you. Stop waiting for applause. Build yourself."
  },
  {
    title: "The Connection",
    script: "We are all just particles, momentarily arranged. We look for 'the' meaning, as if it's a hidden treasure. But the meaning isn't found. It's built. It's in the late-night talk. The shared silence. The moment you help someone else carry their weight. You are not a human searching for meaning. You are the meaning being created."
  }
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
];

export const VOICE_TONE_OPTIONS: VoiceTone[] = [
  'Motivational',
  'Calm',
  'Storyteller',
  'Deep',
  'Friendly',
];
