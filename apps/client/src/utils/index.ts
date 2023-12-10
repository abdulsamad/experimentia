import localforage from 'localforage';

// shadcn/ui utility
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const speechLog = (text: string, styles?: React.CSSProperties) => {
  console.log(
    `%cSPEECH RECOGNITION: %c${text}`,
    'font-size: 12px;font-weight: bold; color: #2196F3;',
    'font-size: 12px;color: #e3e3e3;'
  );
};

export const speechGrammer =
  '#JSGF V1.0; grammar colors; public <color> = aqua | azure | black | orange ;';

export const IS_SPEECH_RECOGNITION_SUPPORTED = () =>
  'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

export const IS_SPEECH_SYNTHESIS_SUPPORTED = () => 'speechSynthesis' in window;

export const lforage = localforage.createInstance({
  name: 'experimentia',
  description: 'A chat application',
  version: 1.0,
});
