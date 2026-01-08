const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all categories for a user (defaults + custom)
router.get('/', async (req, res) => {
    try {
        const userId = req.query.user_id || 1;

        const query = `
            SELECT * FROM categories 
            WHERE is_default = TRUE OR user_id = ? 
            ORDER BY category_name ASC
        `;

        const [rows] = await db.execute(query, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
