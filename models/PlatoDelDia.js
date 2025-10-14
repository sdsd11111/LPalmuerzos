// Note: This model now uses the global.pool set in server.js

const { query, run } = require('../config/db');

class PlatoDelDia {
    static async create({ titulo, descripcion, valor, imagen_url = null, activo = false }) {
        const sql = `
            INSERT INTO PlatosDelDia (titulo, descripcion, valor, imagen_url, activo)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [titulo, descripcion, valor, imagen_url, activo ? 1 : 0];
        const result = await run(sql, params);
        return result.lastID;
    }

    static async findAll() {
        const sql = 'SELECT * FROM PlatosDelDia ORDER BY fecha_actualizacion DESC';
        const rows = await query(sql);
        return rows.map(row => ({
            ...row,
            activo: Boolean(row.activo)
        }));
    }

    static async findActive() {
        const sql = 'SELECT * FROM PlatosDelDia WHERE activo = 1 ORDER BY fecha_actualizacion DESC';
        const rows = await query(sql);
        return rows.map(row => ({
            ...row,
            activo: true
        }));
    }

    static async findById(id) {
        const sql = 'SELECT * FROM PlatosDelDia WHERE id_plato = ?';
        const rows = await query(sql, [id]);
        if (rows.length === 0) return null;
        
        const row = rows[0];
        return {
            ...row,
            activo: Boolean(row.activo)
        };
    }

    static async update(id, { titulo, descripcion, valor, imagen_url, activo }) {
        const sql = `
            UPDATE PlatosDelDia 
            SET titulo = ?, 
                descripcion = ?, 
                valor = ?, 
                imagen_url = ?, 
                activo = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id_plato = ?
        `;
        const params = [titulo, descripcion, valor, imagen_url, activo ? 1 : 0, id];
        await run(sql, params);
        return this.findById(id);
    }

    static async delete(id) {
        const plato = await this.findById(id);
        if (!plato) return null;
        
        const sql = 'DELETE FROM PlatosDelDia WHERE id_plato = ?';
        await run(sql, [id]);
        return plato;
    }

    static async toggleStatus(id) {
        const plato = await this.findById(id);
        if (!plato) return null;
        
        const newStatus = !plato.activo;
        const sql = 'UPDATE PlatosDelDia SET activo = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_plato = ?';
        await run(sql, [newStatus ? 1 : 0, id]);
        return this.findById(id);
    }

    // Helper method to format image URLs
    static formatImageUrl(url) {
        if (!url) return null;
        // If it's already a full URL, return as is
        if (url.startsWith('http')) return url;
        // If it's a local path, make sure it starts with /
        return url.startsWith('/') ? url : `/${url}`;
    }
}

module.exports = PlatoDelDia;
