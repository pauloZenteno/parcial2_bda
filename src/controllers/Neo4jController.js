const { driver } = require('../config/neo4j');

const getInteractions = async (req, res) => {
    const { medicationName } = req.params;
    const session = driver.session();
    
    try {
        const query = `
            MATCH (m1:Medication {name: $medicationName})
            - [i:INTERACTS_WITH] ->
            (m2:Medication)
            RETURN m2.name AS interactsWith, i.severity AS severity, i.warning AS warning
        `;
        
        const result = await session.run(query, { medicationName });
        
        const interactions = result.records.map(record => ({
            interactsWith: record.get('interactsWith'),
            severity: record.get('severity'),
            warning: record.get('warning'),
        }));

        if (interactions.length === 0) {
            return res.status(200).json({ message: 'No se encontraron interacciones directas.', medication: medicationName });
        }

        res.status(200).json({ medication: medicationName, interactions });

    } catch (error) {
        console.error('Error al consultar Neo4j:', error);
        res.status(500).json({ message: 'Error interno al consultar la base de datos de Grafos.' });
    } finally {
        await session.close();
    }
};

module.exports = { getInteractions };