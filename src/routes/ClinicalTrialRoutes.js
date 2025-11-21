const express = require('express');
const { createReport, getReports } = require('../controllers/ClinicalTrialController');
const router = express.Router();

router.post('/reports', createReport);
router.get('/reports', getReports);

module.exports = router;