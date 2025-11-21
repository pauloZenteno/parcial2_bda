const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const connectMongo = require('./config/mongo');
const { connectRedis } = require('./config/redis');
const { connectNeo4j } = require('./config/neo4j');
const inventoryRoutes = require('./routes/InventoryRoutes');
const neo4jRoutes = require('./routes/Neo4jRoutes');
const clinicalTrialRoutes = require('./routes/ClinicalTrialRoutes');
const cacheRoutes = require('./routes/CacheRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectMongo();
connectRedis();
connectNeo4j();

app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/graph', neo4jRoutes);
app.use('/api/trials', clinicalTrialRoutes);
app.use('/api/cache', cacheRoutes);

app.get('/', (req, res) => {
    res.send('💊 API PharmaFlow Solutions funcionando correctamente');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la base de datos');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});