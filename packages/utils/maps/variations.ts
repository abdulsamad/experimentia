import { variations as variationsTypes } from '../types';

interface IVariations {
  code: variationsTypes;
  text: string;
  selected: boolean;
  hint: string;
}

export const variations: IVariations[] = [
  {
    code: 'normal',
    text: 'Normal',
    selected: true,
    hint: '',
  },
  {
    code: 'grammar-corrector',
    text: 'Grammar Corrector',
    selected: false,
    hint: '',
  },
  {
    code: 'doctor',
    text: 'Doctor',
    selected: false,
    hint: '',
  },
  {
    code: 'web-design-consultant',
    text: 'Web Design Consultant',
    selected: false,
    hint: '',
  },
  {
    code: 'poet',
    text: 'Poet',
    selected: false,
    hint: '',
  },
  {
    code: 'rapper',
    text: 'Rapper',
    selected: false,
    hint: '',
  },
  {
    code: 'math-teacher',
    text: 'Math Teacher',
    selected: false,
    hint: '',
  },
  {
    code: 'historian',
    text: 'Historian',
    selected: false,
    hint: '',
  },
  {
    code: 'chef',
    text: 'Chef',
    selected: false,
    hint: '',
  },
  {
    code: 'makeup-artist',
    text: 'Makeup Artist',
    selected: false,
    hint: '',
  },
  {
    code: 'data-scientist',
    text: 'Data Scientist',
    selected: false,
    hint: '',
  },
  {
    code: 'advertiser',
    text: 'Advertiser',
    selected: false,
    hint: '',
  },
  {
    code: 'legal-advisor',
    text: 'Legal Advisor',
    selected: false,
    hint: '',
  },
  {
    code: 'it-expert',
    text: 'IT Expert',
    selected: false,
    hint: '',
  },
  {
    code: 'technical-writer',
    text: 'Technical Writer',
    selected: false,
    hint: '',
  },
  {
    code: 'regex-generator',
    text: 'Regex Generator',
    selected: false,
    hint: '',
  },
  {
    code: 'social-media-influencer',
    text: 'Social Media Influencer',
    selected: false,
    hint: '',
  },
  {
    code: 'gavin-belson',
    text: 'Gavin Belson',
    selected: false,
    hint: '',
  },
  {
    code: 'russ-hanneman',
    text: 'Russ Hanneman',
    selected: false,
    hint: '',
  },
  {
    code: 'munna',
    text: 'Munna Bhai',
    selected: false,
    hint: '',
  },
  {
    code: 'prompt-generator',
    text: 'Prompt Generator',
    selected: false,
    hint: '',
  },
];

export default variations;
