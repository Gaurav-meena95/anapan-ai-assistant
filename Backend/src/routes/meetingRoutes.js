const express = require('express');
const { getUpcoming } = require('../controllers/meetingController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/upcoming', verifyToken, getUpcoming);

module.exports = router;
