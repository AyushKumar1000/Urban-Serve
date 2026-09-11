const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/quick-service
 * Create a new quick service request
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { serviceType, location, lat, lng } = req.body;
    const customerId = req.user.id;

    const result = await pool.query(
      `INSERT INTO quick_service_requests (customer_id, service_type, location, location_lat, location_lng, status)
       VALUES ($1, $2, $3, $4, $5, 'searching')
       RETURNING *`,
      [customerId, serviceType, location || 'Live GPS Location', lat || null, lng || null]
    );

    const row = result.rows[0];
    res.status(201).json(formatQuickService(row));
  } catch (err) {
    console.error('Create quick service error:', err);
    res.status(500).json({ error: 'Server error creating quick service request' });
  }
});

/**
 * GET /api/quick-service/:id
 * Get a quick service request by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT qsr.*, u.name as pro_name, u.phone as pro_phone, u.lat as pro_lat, u.lng as pro_lng
       FROM quick_service_requests qsr
       LEFT JOIN users u ON qsr.professional_id = u.id
       WHERE qsr.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quick service request not found' });
    }

    const row = result.rows[0];
    res.json(formatQuickService(row));
  } catch (err) {
    console.error('Get quick service error:', err);
    res.status(500).json({ error: 'Server error fetching quick service request' });
  }
});

/**
 * POST /api/quick-service/:id/match
 * Simulate matching a professional to the request
 */
router.post('/:id/match', authenticateToken, async (req, res) => {
  try {
    // Find nearest available service team member
    const proResult = await pool.query(
      `SELECT id, name, phone, lat, lng FROM users 
       WHERE role = 'service_team' AND approval_status = 'approved'
       LIMIT 1`
    );

    let professionalId = null;
    let proName = 'Elena Rodriguez';
    let proPhone = '+1 (555) 234-9871';
    let proLat = null;
    let proLng = null;

    if (proResult.rows.length > 0) {
      const pro = proResult.rows[0];
      professionalId = pro.id;
      proName = pro.name;
      proPhone = pro.phone;
      proLat = pro.lat;
      proLng = pro.lng;
    }

    // Get the request to find user coordinates for simulating partner start
    const reqResult = await pool.query(
      'SELECT location_lat, location_lng FROM quick_service_requests WHERE id = $1',
      [req.params.id]
    );

    let partnerLat = 28.6310;
    let partnerLng = 77.2280;
    if (reqResult.rows.length > 0 && reqResult.rows[0].location_lat) {
      partnerLat = reqResult.rows[0].location_lat + 0.015;
      partnerLng = reqResult.rows[0].location_lng + 0.018;
    }

    const result = await pool.query(
      `UPDATE quick_service_requests 
       SET status = 'matched', 
           professional_id = $1, 
           matched_at = NOW(),
           estimated_arrival = NOW() + INTERVAL '12 minutes',
           distance_km = 0.8,
           eta_minutes = 12
       WHERE id = $2
       RETURNING *`,
      [professionalId, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quick service request not found' });
    }

    const row = result.rows[0];
    // Attach professional info
    row.pro_name = proName;
    row.pro_phone = proPhone;
    row.pro_lat = proLat || partnerLat;
    row.pro_lng = proLng || partnerLng;

    res.json(formatQuickService(row));
  } catch (err) {
    console.error('Match quick service error:', err);
    res.status(500).json({ error: 'Server error matching quick service' });
  }
});

/**
 * PUT /api/quick-service/:id/status
 * Update quick service status
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE quick_service_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quick service request not found' });
    }

    // Fetch with professional info
    const fullResult = await pool.query(
      `SELECT qsr.*, u.name as pro_name, u.phone as pro_phone, u.lat as pro_lat, u.lng as pro_lng
       FROM quick_service_requests qsr
       LEFT JOIN users u ON qsr.professional_id = u.id
       WHERE qsr.id = $1`,
      [req.params.id]
    );

    res.json(formatQuickService(fullResult.rows[0]));
  } catch (err) {
    console.error('Update quick service status error:', err);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

/**
 * Format a quick service row into the frontend-expected shape
 */
function formatQuickService(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    serviceType: row.service_type,
    location: row.location,
    locationCoords: row.location_lat ? { lat: row.location_lat, lng: row.location_lng } : undefined,
    status: row.status,
    requestedAt: row.requested_at,
    matchedAt: row.matched_at,
    estimatedArrival: row.estimated_arrival,
    distanceKm: row.distance_km ? parseFloat(row.distance_km) : undefined,
    etaMinutes: row.eta_minutes,
    userTargetCoords: row.location_lat ? { lat: row.location_lat, lng: row.location_lng } : undefined,
    partnerStartCoords: row.pro_lat ? { lat: row.pro_lat, lng: row.pro_lng } : undefined,
    professional: row.pro_name ? {
      id: row.professional_id || 'p1',
      name: row.pro_name,
      rating: 4.9,
      reviewCount: 340,
      phone: row.pro_phone || '+1 (555) 234-9871',
      vehicle: 'Honda Activa Pro • EV-842',
      distanceKm: row.distance_km ? parseFloat(row.distance_km) : 0.8,
    } : undefined,
  };
}

module.exports = router;
