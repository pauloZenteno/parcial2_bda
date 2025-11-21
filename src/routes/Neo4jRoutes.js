const express = require('express');
const { getInteractions } = require('../controllers/Neo4jController');
const router = express.Router();

router.get('/interactions/:medicationName', getInteractions);

module.exports = router;