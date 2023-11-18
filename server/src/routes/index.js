const express = require('express');

const chatController = require('../controllers/chat');
const imageController = require('../controllers/image');

const router = express.Router();

router.route('/text').post(chatController);
router.route('/image').post(imageController);

module.exports = router;
