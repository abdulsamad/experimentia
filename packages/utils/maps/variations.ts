import { variations as variationsTypes } from '../types';

interface IVariations {
  code: variationsTypes;
  text: string;
  selected: boolean;
  description: string;
  hints: string[];
}

export const variations: IVariations[] = [
  {
    code: 'normal',
    text: 'Normal',
    selected: true,
    description: '',
    hints: [],
  },
  {
    code: 'snarky',
    text: 'Snarky Bot',
    selected: false,
    description: 'Snarky is sarcastic, funny and informative bot.',
    hints: [
      'How many pounds are in a kilogram?',
      'What does HTML stand for?',
      'When did the first airplance fly?',
      'Who invented Telephone?',
    ],
  },
  {
    code: 'grammar-corrector',
    text: 'Grammar Corrector',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'doctor',
    text: 'Doctor',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'web-design-consultant',
    text: 'Web Design Consultant',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'poet',
    text: 'Poet',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'rapper',
    text: 'Rapper',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'math-teacher',
    text: 'Math Teacher',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'historian',
    text: 'Historian',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'chef',
    text: 'Chef',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'makeup-artist',
    text: 'Makeup Artist',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'data-scientist',
    text: 'Data Scientist',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'advertiser',
    text: 'Advertiser',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'legal-advisor',
    text: 'Legal Advisor',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'it-expert',
    text: 'IT Expert',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'technical-writer',
    text: 'Technical Writer',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'regex-generator',
    text: 'Regex Generator',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'social-media-influencer',
    text: 'Social Media Influencer',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'gavin-belson',
    text: 'Gavin Belson',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'russ-hanneman',
    text: 'Russ Hanneman',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'munna',
    text: 'Munna Bhai',
    selected: false,
    description: '',
    hints: [],
  },
  {
    code: 'prompt-generator',
    text: 'Prompt Generator',
    selected: false,
    description: '',
    hints: [],
  },
];

export default variations;
