import { variations as variationsTypes } from '../types';

interface IVariations {
  code: variationsTypes;
  text: string;
  selected: boolean;
}

export const variations: IVariations[] = [
  {
    code: 'normal',
    text: 'Normal',
    selected: true,
  },
  {
    code: 'grammar-corrector',
    text: 'Grammar Corrector',
    selected: false,
  },
  {
    code: 'doctor',
    text: 'Doctor',
    selected: false,
  },
  {
    code: 'web-design-consultant',
    text: 'Web Design Consultant',
    selected: false,
  },
  {
    code: 'poet',
    text: 'Poet',
    selected: false,
  },
  {
    code: 'rapper',
    text: 'Rapper',
    selected: false,
  },
  {
    code: 'math-teacher',
    text: 'Math Teacher',
    selected: false,
  },
  {
    code: 'historian',
    text: 'Historian',
    selected: false,
  },
  {
    code: 'chef',
    text: 'Chef',
    selected: false,
  },
  {
    code: 'makeup-artist',
    text: 'Makeup Artist',
    selected: false,
  },
  {
    code: 'data-scientist',
    text: 'Data Scientist',
    selected: false,
  },
  {
    code: 'advertiser',
    text: 'Advertiser',
    selected: false,
  },
  {
    code: 'legal-advisor',
    text: 'Legal Advisor',
    selected: false,
  },
  {
    code: 'it-expert',
    text: 'IT Expert',
    selected: false,
  },
  {
    code: 'technical-writer',
    text: 'Technical Writer',
    selected: false,
  },
  {
    code: 'regex-generator',
    text: 'Regex Generator',
    selected: false,
  },
  {
    code: 'social-media-influencer',
    text: 'Social Media Influencer',
    selected: false,
  },
  {
    code: 'gavin-belson',
    text: 'Gavin Belson',
    selected: false,
  },
  {
    code: 'russ-hanneman',
    text: 'Russ Hanneman',
    selected: false,
  },
  {
    code: 'munna',
    text: 'Munna Bhai',
    selected: false,
  },
  {
    code: 'prompt_generator',
    text: 'Prompt Generator',
    selected: false,
  },
];

export default variations;
