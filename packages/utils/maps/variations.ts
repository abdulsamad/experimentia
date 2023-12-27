import { variations as variationsTypes } from '../types';

interface IVariations {
  code: variationsTypes;
  text: string;
  selected: boolean;
  description: string;
  hint: string;
}

export const variations: IVariations[] = [
  {
    code: 'normal',
    text: 'Normal',
    selected: true,
    description: '',
    hint: '',
  },
  {
    code: 'snarky',
    text: 'Snarky Bot',
    selected: false,
    description: 'Snarky is sarcastic, funny and informative bot.',
    hint: 'How many pounds are in a kilogram?',
  },
  {
    code: 'grammar-corrector',
    text: 'Grammar Corrector',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'doctor',
    text: 'Doctor',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'web-design-consultant',
    text: 'Web Design Consultant',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'poet',
    text: 'Poet',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'rapper',
    text: 'Rapper',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'math-teacher',
    text: 'Math Teacher',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'historian',
    text: 'Historian',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'chef',
    text: 'Chef',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'makeup-artist',
    text: 'Makeup Artist',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'data-scientist',
    text: 'Data Scientist',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'advertiser',
    text: 'Advertiser',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'legal-advisor',
    text: 'Legal Advisor',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'it-expert',
    text: 'IT Expert',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'technical-writer',
    text: 'Technical Writer',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'regex-generator',
    text: 'Regex Generator',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'social-media-influencer',
    text: 'Social Media Influencer',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'gavin-belson',
    text: 'Gavin Belson',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'russ-hanneman',
    text: 'Russ Hanneman',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'munna',
    text: 'Munna Bhai',
    selected: false,
    description: '',
    hint: '',
  },
  {
    code: 'prompt-generator',
    text: 'Prompt Generator',
    selected: false,
    description: '',
    hint: '',
  },
];

export default variations;
