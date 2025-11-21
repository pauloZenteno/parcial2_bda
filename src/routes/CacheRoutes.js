const express = require('express');
const { getExchangeRate } = require('../controllers/CacheController');
const router = express.Router();

router.get('/exchange-rate', getExchangeRate);

module.exports = router;