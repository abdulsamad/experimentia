import express from 'express';

import textController from '@controllers/text';
import imageController from '@controllers/image';

const router = express.Router();

router.route('/text').post(textController);
router.route('/image').post(imageController);

export default router;
