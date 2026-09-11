const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create a new user (customer or service_team)
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role, serviceCategory } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine approval status
    const approvalStatus = role === 'service_team' ? 'pending' : null;

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role, service_category, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, role, name, email, phone, address, lat, lng, service_category, approval_status, created_at`,
      [name, email, passwordHash, phone || null, role, serviceCategory || null, approvalStatus]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        coordinates: user.lat && user.lng ? { lat: user.lat, lng: user.lng } : undefined,
        serviceCategory: user.service_category,
        approvalStatus: user.approval_status,
      },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or user not found' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        coordinates: user.lat && user.lng ? { lat: user.lat, lng: user.lng } : undefined,
        serviceCategory: user.service_category,
        approvalStatus: user.approval_status,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * PUT /api/auth/location
 * Update user's address and coordinates
 */
router.put('/location', async (req, res) => {
  try {
    const { userId, address, lat, lng } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await pool.query(
      `UPDATE users SET address = $1, lat = $2, lng = $3 WHERE id = $4
       RETURNING id, role, name, email, phone, address, lat, lng, service_category, approval_status`,
      [address || null, lat || null, lng || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      coordinates: user.lat && user.lng ? { lat: user.lat, lng: user.lng } : undefined,
      serviceCategory: user.service_category,
      approvalStatus: user.approval_status,
    });
  } catch (err) {
    console.error('Location update error:', err);
    res.status(500).json({ error: 'Server error updating location' });
  }
});

module.exports = router;
