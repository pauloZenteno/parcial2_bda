const mongoose = require('mongoose');

const ClinicalTrialSchema = new mongoose.Schema({
    trial_name: { type: String, required: true },
    phase: { type: String, enum: ['Fase I', 'Fase II', 'Fase III'], required: true },
    start_date: { type: Date, default: Date.now },
    researcher_id: { type: Number, required: true },
    details: { type: mongoose.Schema.Types.Mixed } 
});

module.exports = mongoose.model('ClinicalTrial', ClinicalTrialSchema);