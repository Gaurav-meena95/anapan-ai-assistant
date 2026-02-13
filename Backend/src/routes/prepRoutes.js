const express = require('express');
const { generatePrep } = require('../controllers/prepController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/generate', verifyToken, generatePrep);

module.exports = router;
