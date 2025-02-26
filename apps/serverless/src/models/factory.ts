import { LanguageModelV1 } from 'ai';

import { googleClient, openAiClient, ModelName } from '.';

class ModelFactory {
  private static instance: ModelFactory;
  private modelInstances: Map<string, LanguageModelV1> = new Map();

  private constructor() {
    //
  }

  public static getInstance(): ModelFactory {
    if (!ModelFactory.instance) {
      ModelFactory.instance = new ModelFactory();
    }

    return ModelFactory.instance;
  }

  public createModel(modelName: ModelName): LanguageModelV1 {
    const cacheKey = `${modelName}`;

    if (this.modelInstances.has(cacheKey)) {
      return this.modelInstances.get(cacheKey)!;
    }

    let model: LanguageModelV1;

    switch (true) {
      case modelName.startsWith('gemini'): {
        model = googleClient(modelName, {
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
          ],
        });

        break;
      }

      case modelName.startsWith('gpt'): {
        model = openAiClient(modelName, {
          //
        });

        break;
      }

      default: {
        throw new Error(`Unsupported model: ${modelName}`);
      }
    }

    this.modelInstances.set(cacheKey, model);
    return model;
  }
}

export const modelFactory = ModelFactory.getInstance();
