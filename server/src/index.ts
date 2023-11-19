import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';

import routes from './routes';

require('dotenv').config();

const app = express();
const PORT = 3001;

const jwtCheck = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	tokenSigningAlg: 'RS256',
});

const corsOption = {
	origin: [
		'http://localhost:3000',
		'https://experimentia.netlify.app',
		'https://experimentia.vercel.app',
	],
};

app.use(cors(corsOption));
app.use(jwtCheck);
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
