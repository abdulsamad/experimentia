const express = require('express');

const textController = require('../controllers/text');
const imageController = require('../controllers/image');

const router = express.Router();

router.route('/text').post(textController);
router.route('/image').post(imageController);

module.exports = router;
