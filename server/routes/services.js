const express = require('express');
const pool = require('../db');

const router = express.Router();

/**
 * GET /api/services
 * Get all services with optional search & category filter
 */
router.get('/', async (req, res) => {
  try {
    const { query, category } = req.query;
    let sql = `
      SELECT s.*, 
        u.name as professional_name, 
        u.id as professional_user_id
      FROM services s
      LEFT JOIN users u ON s.professional_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND s.category = $${params.length}`;
    }

    if (query) {
      params.push(`%${query.toLowerCase()}%`);
      sql += ` AND (LOWER(s.title) LIKE $${params.length} OR LOWER(s.description) LIKE $${params.length})`;
    }

    sql += ' ORDER BY s.created_at DESC';

    const result = await pool.query(sql, params);

    const services = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      title: row.title,
      description: row.description,
      priceRange: { min: parseFloat(row.price_min), max: parseFloat(row.price_max) },
      professional: {
        id: row.professional_user_id || row.id,
        name: row.professional_name || 'UrbanServe Pro',
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 200) + 50,
      },
      availableSlots: row.available_slots || [],
    }));

    res.json(services);
  } catch (err) {
    console.error('Get services error:', err);
    res.status(500).json({ error: 'Server error fetching services' });
  }
});

/**
 * GET /api/services/categories
 * Get all unique categories
 */
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM services ORDER BY category');
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

/**
 * GET /api/services/:id
 * Get single service by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as professional_name, u.id as professional_user_id
       FROM services s
       LEFT JOIN users u ON s.professional_id = u.id
       WHERE s.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      category: row.category,
      title: row.title,
      description: row.description,
      priceRange: { min: parseFloat(row.price_min), max: parseFloat(row.price_max) },
      professional: {
        id: row.professional_user_id || row.id,
        name: row.professional_name || 'UrbanServe Pro',
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 200) + 50,
      },
      availableSlots: row.available_slots || [],
    });
  } catch (err) {
    console.error('Get service error:', err);
    res.status(500).json({ error: 'Server error fetching service' });
  }
});

module.exports = router;
