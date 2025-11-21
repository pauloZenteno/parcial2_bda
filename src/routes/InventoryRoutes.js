const express = require('express');
const { sellItemOptimistic } = require('../controllers/InventoryController');
const router = express.Router();

router.post('/sell/optimistic', sellItemOptimistic);

module.exports = router;