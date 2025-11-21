const ClinicalTrial = require('../models/ClinicalTrial');

const createReport = async (req, res) => {
    try {
        const newReport = new ClinicalTrial(req.body);
        await newReport.save();
        res.status(201).json({ message: 'Reporte de ensayo clínico registrado con éxito.', report: newReport });
    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ message: 'Error interno al registrar el reporte.' });
    }
};

const getReports = async (req, res) => {
    try {
        // Se limita a 10 reportes para ejemplo
        const reports = await ClinicalTrial.find().limit(10);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({ message: 'Error interno al obtener los reportes.' });
    }
};

module.exports = { createReport, getReports };