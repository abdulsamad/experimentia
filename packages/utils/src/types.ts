import { supportedModels, variations } from './models';
import { languages } from './languages';

export type supportedModelsType = (typeof supportedModels)[number]['name'];

export type supportedLanguagesType = (typeof languages)[number]['code'];

export type variationsType = (typeof variations)[number]['code'];
