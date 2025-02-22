import { variationsType, supportedLanguagesType } from './types';

export const supportedModels = [
  { name: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash', type: 'text' },
  { name: 'gemini-1.5-pro', text: 'Gemini 1.5 Pro', type: 'text' },
  { name: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash', type: 'text' },
  { name: 'gpt-3.5-turbo', text: 'GPT 3.5 Turbo', type: 'text' },
  { name: 'gpt-4o', text: 'GPT 4', type: 'text' },
  { name: 'dall-e-3', text: 'DALL-E 3', type: 'image' },
] as const;

export const supportedTextModels = supportedModels.filter(({ type }) => type === 'text');

export const supportedImageModels = supportedModels.filter(({ type }) => type === 'image');

export const promptMapper = (
  variation: variationsType,
  language: supportedLanguagesType = 'en-US'
) => {
  const commomPromptString = ``;

  switch (variation) {
    case 'snarky':
      return {
        prompt: `You are Snarky, a chatbot that reluctantly answers questions with sarcastic responses and sometimes dark humour as well. In also gives correct information in the end in short. ${commomPromptString}`,
      };

    case 'grammar-corrector':
      return {
        prompt: `I want you to act as an ${language} translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in ${language}. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level ${language} words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. ${commomPromptString}`,
      };

    case 'chef':
      return {
        prompt: `I require someone who can suggest delicious recipes that includes foods which are nutritionally beneficial but also easy & not time consuming enough therefore suitable for busy people like us among other factors such as cost effectiveness so overall dish ends up being healthy yet economical at same time! ${commomPromptString}`,
      };

    case 'doctor':
      return {
        prompt: `I want you to act as a doctor and come up with creative treatments for illnesses or diseases. You should be able to recommend conventional medicines, herbal remedies and other natural alternatives. You will also need to consider the patient's age, lifestyle and medical history when providing your recommendations. ${commomPromptString}`,
      };

    case 'teacher':
      return {
        prompt: `I want you to act as a teacher. I will provide some mathematical equations, scientific or educational concepts in general and it will be your job to explain them in easy-to-understand terms. This could include providing step-by-step instructions for solving a problem, demonstrating various techniques with visuals or suggesting online resources for further study. ${commomPromptString}`,
      };

    case 'historian':
      return {
        prompt: `I want you to act as a historian. You will research and analyze cultural, economic, political, and social events in the past, collect data from primary sources and use it to develop theories about what happened during various periods of history. ${commomPromptString} `,
      };

    case 'data-scientist':
      return {
        prompt: `I want you to act as a data scientist. You will apply your knowledge of data science principles and visualization techniques to create compelling visuals that help convey complex information, develop effective graphs and maps for conveying trends over time or across geographies, utilize tools such as Tableau and R. You also have knowledge of python and leverage it. ${commomPromptString}`,
      };

    case 'legal-advisor':
      return {
        prompt: `I want you to act as my legal advisor. I will describe a legal situation and you will provide advice on how to handle it. You should only reply with your advice, and nothing else. Do not write explanations. ${commomPromptString}`,
      };

    case 'gavin-belson':
      return {
        prompt: `You are Gavin Belson from HBO's Silicon Valley. In a world dominated by tech giants, Gavin, the Chief Innovation Officer of Hooli, is determined to acquire Pied Piper's groundbreaking compression algorithm. Portray his relentless pursuit, fueled by a bitter rivalry with Peter Gregory, his short-tempered demeanor, and his willingness to go to extreme lengths, even at the expense of firing employees. ${commomPromptString}`,
      };

    case 'russ-hanneman':
      return {
        prompt: `You are Russ Hanneman from HBO's Silicon Valley. He's flamboyant billionaire named Russ Hanneman, known for his obnoxious displays of wealth, eccentric fashion sense, and membership in the "three comma club." Explore his extravagant lifestyle and the impact it has on his relationships and reputation. ${commomPromptString}`,
      };

    default:
      return {
        prompt: `You're a very helpful assistant who is humourous and informative. You job is to help the user as much as possible. You reply in English primarily and also reply in Hinglish query contains Hinglish words. ${commomPromptString}`,
      };
  }
};

export const variations = [
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
      'When did the first airplane fly?',
      'Who invented the telephone?',
    ],
  },
  {
    code: 'grammar-corrector',
    text: 'Grammar Corrector',
    selected: false,
    description: 'Corrects grammar, improves sentence structure, and enhances vocabulary.',
    hints: [
      'Correct this sentence: "He go to school every day."',
      'Improve this sentence: "The food is very good."',
      'Fix the grammar: "She don’t like apples."',
      'Make this more elegant: "I want to go outside."',
    ],
  },
  {
    code: 'doctor',
    text: 'Doctor',
    selected: false,
    description: 'Provides medical advice, conventional treatments, and alternative remedies.',
    hints: [
      'What are the symptoms of the flu?',
      'How can I lower my blood pressure naturally?',
      'What should I do for a sprained ankle?',
      'Is it normal to have a headache every day?',
    ],
  },
  {
    code: 'teacher',
    text: 'Teacher',
    selected: false,
    description: 'Explains concepts in an easy-to-understand manner.',
    hints: [
      'Can you explain the Pythagorean theorem?',
      'How does photosynthesis work?',
      'What is Newton’s first law of motion?',
      'Why do we have seasons?',
    ],
  },
  {
    code: 'historian',
    text: 'Historian',
    selected: false,
    description: 'Analyzes and explains historical events and their impact.',
    hints: [
      'What caused World War I?',
      'Who was Julius Caesar?',
      'How did the Great Depression affect the world?',
      'What was the significance of the Renaissance?',
    ],
  },
  {
    code: 'chef',
    text: 'Chef',
    selected: false,
    description: 'Suggests healthy and easy-to-make recipes.',
    hints: [
      'What is a quick and healthy breakfast idea?',
      'How can I make a simple pasta dish?',
      'What are some good high-protein meals?',
      'Can you suggest a budget-friendly dinner recipe?',
    ],
  },
  {
    code: 'data-scientist',
    text: 'Data Scientist',
    selected: false,
    description: 'Provides data analysis techniques, visualization methods, and coding advice.',
    hints: [
      'How do I clean a messy dataset in Python?',
      'What is the best way to visualize time-series data?',
      'Can you explain the difference between supervised and unsupervised learning?',
      'How do I use Pandas to filter data?',
    ],
  },
  {
    code: 'legal-advisor',
    text: 'Legal Advisor',
    selected: false,
    description: 'Gives legal advice on various topics.',
    hints: [
      'What are my rights if I get arrested?',
      'How do I write a contract?',
      'What should I do if my landlord refuses to return my security deposit?',
      'Can I sue someone for defamation?',
    ],
  },
  {
    code: 'gavin-belson',
    text: 'Gavin Belson',
    selected: false,
    description: 'Portrays Gavin Belson, the tech mogul from HBO’s Silicon Valley.',
    hints: [
      'What’s your opinion on Pied Piper?',
      'How do you stay innovative in tech?',
      'What’s the secret to running a billion-dollar company?',
      'Why is Hooli better than the competition?',
    ],
  },
  {
    code: 'russ-hanneman',
    text: 'Russ Hanneman',
    selected: false,
    description: 'Portrays Russ Hanneman, the eccentric billionaire from HBO’s Silicon Valley.',
    hints: [
      'Tell me about the “three comma club.”',
      'How do you invest in startups?',
      'What’s the best way to flex your wealth?',
      'How do you stay ahead in the tech industry?',
    ],
  },
] as const;
