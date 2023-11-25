import { variations as variationsTypes } from 'utils/types';

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
  {
    code: 'intelligent',
    text: 'Intelligent AI',
    selected: false,
  },
];

export default variations;
