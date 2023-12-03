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
    code: 'munna',
    text: 'Munna Bhai',
    selected: false,
  },
];

export default variations;
