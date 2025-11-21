const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const connectNeo4j = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('✅ Conexión exitosa a Neo4j (Grafos)');
    } catch (error) {
        console.error('❌ Error conectando a Neo4j', error.message);
    }
};

// Exportamos la función de conexión y el driver
module.exports = { connectNeo4j, driver };