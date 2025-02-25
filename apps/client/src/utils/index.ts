// shadcn/ui utility
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const speechLog = (text: string, styles?: React.CSSProperties) => {
  const defaultStyles = {
    fontSize: '12px',
    color: '#e3e3e3',
  };

  const labelStyles = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#2196F3',
  };

  const mergedStyles = {
    ...defaultStyles,
    ...styles,
  };

  console.log(
    `%cSPEECH RECOGNITION: %c${text}`,
    Object.entries(labelStyles)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`)
      .join(';'),
    Object.entries(mergedStyles)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`)
      .join(';')
  );
};

export const speechGrammer =
  '#JSGF V1.0; grammar colors; public <color> = aqua | azure | black | orange ;';

export const IS_SPEECH_RECOGNITION_SUPPORTED = () =>
  'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

export const IS_SPEECH_SYNTHESIS_SUPPORTED = () => 'speechSynthesis' in window;
