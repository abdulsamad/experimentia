import { supportedLanguages } from '../types';

interface ILanguages {
  code: supportedLanguages;
  text: string;
  selected: boolean;
}

export const languages: ILanguages[] = [
  {
    code: 'en-IN',
    text: 'English (Indian)',
    selected: true,
  },
  {
    code: 'en-US',
    text: 'English (United States)',
    selected: false,
  },
  {
    code: 'en-UK',
    text: 'English (United Kingdom)',
    selected: false,
  },
  {
    code: 'hi-IN',
    text: 'Hindi',
    selected: false,
  },
  {
    code: 'ur-IN',
    text: 'Urdu',
    selected: false,
  },
  {
    code: 'ar-EG',
    text: 'Arabic',
    selected: false,
  },
  {
    code: 'tr-TR',
    text: 'Turkish',
    selected: false,
  },
];

export default languages;
