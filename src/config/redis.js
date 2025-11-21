const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('❌ Error de Redis Client', err));

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('✅ Conexión exitosa a Redis (Clave-Valor)');
    } catch (err) {
        console.error('❌ No se pudo conectar a Redis', err);
    }
};

// Exportamos tanto la función de conexión como el cliente (para usarlo después en caché)
module.exports = { connectRedis, client };