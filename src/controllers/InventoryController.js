const pool = require('../config/db');

const sellItemOptimistic = async (req, res) => {
    const { batchId, quantitySold, currentVersion } = req.body;

    if (!batchId || !quantitySold || currentVersion === undefined) {
        return res.status(400).json({ message: 'Datos incompletos.' });
    }

    try {
        const result = await pool.query(
            `
            UPDATE batches
            SET 
                quantity = quantity - $1, 
                version = version + 1
            WHERE 
                id = $2 AND version = $3 AND quantity >= $1
            RETURNING id, batch_number, quantity, version;
            `,
            [quantitySold, batchId, currentVersion]
        );

        if (result.rowCount === 0) {
            // Falla si: A) No se encontró el lote, B) No había suficiente inventario, o C) La versión cambió (Colisión).
            const batchCheck = await pool.query('SELECT version FROM batches WHERE id = $1', [batchId]);
            
            if (batchCheck.rows.length > 0 && batchCheck.rows[0].version !== currentVersion) {
                // Caso C: Colisión de Concurrencia
                return res.status(409).json({ message: 'ERROR: Conflicto de Concurrencia Optimista. El lote fue modificado por otro usuario. Intenta de nuevo.', code: 'OCC_FAIL' });
            } else {
                // Caso A/B: Inventario insuficiente o Lote no encontrado.
                return res.status(400).json({ message: 'Error en la venta: Inventario insuficiente o Lote no encontrado.' });
            }
        }

        res.status(200).json({ 
            message: 'Venta realizada con éxito (Control Optimista verificado).', 
            details: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al procesar la venta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = { sellItemOptimistic };