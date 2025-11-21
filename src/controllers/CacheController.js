const { client } = require('../config/redis');

// Tiempo de vida en segundos (TTL) para la caché
const CACHE_TTL = 60; 

const getExchangeRate = async (req, res) => {
    const cacheKey = 'USD_EXCHANGE_RATE';
    
    try {
        // 1. Intentar obtener el valor de Redis (Cache)
        const cachedRate = await client.get(cacheKey);

        if (cachedRate) {
            console.log('Cache Hit: Valor obtenido de Redis.');
            return res.status(200).json({ 
                source: 'Cache Redis', 
                rate: parseFloat(cachedRate), 
                ttl: await client.ttl(cacheKey)
            });
        }

        // 2. Si no está en caché (Cache Miss): Simular API externa y guardar
        const newRate = (Math.random() * (19.5 - 19.0) + 19.0).toFixed(4); 
        
        // Guardar en Redis con tiempo de expiración (EX)
        await client.set(cacheKey, newRate, { EX: CACHE_TTL });
        
        console.log('Cache Miss: Nuevo valor generado y almacenado en Redis.');
        
        res.status(200).json({ 
            source: 'API Externa Simulada', 
            rate: parseFloat(newRate),
            ttl: CACHE_TTL 
        });

    } catch (error) {
        console.error('Error en Redis o en la lógica de caché:', error);
        res.status(500).json({ message: 'Error interno en la gestión de caché.' });
    }
};

module.exports = { getExchangeRate };