import OpenAI from 'openai';
import * as configcat from 'configcat-node';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const configcatClient = configcat.getClient(process.env.CONFIGCAT_API_KEY);

export { openai, configcatClient };
