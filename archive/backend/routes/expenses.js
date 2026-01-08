const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all expenses (with optional filtering)
router.get('/', async (req, res) => {
    try {
        // TODO: Get user_id from session/token
        // For now, we'll assume a user_id of 1 for testing if not provided in query
        const userId = req.query.user_id || 1; 

        let query = `
            SELECT e.*, c.category_name 
            FROM expenses e 
            JOIN categories c ON e.category_id = c.category_id 
            WHERE e.user_id = ?
        `;
        const params = [userId];

        // Filter by category
        if (req.query.category) {
            query += ' AND e.category_id = ?';
            params.push(req.query.category);
        }

        // Filter by date range
        if (req.query.start_date) {
            query += ' AND e.expense_date >= ?';
            params.push(req.query.start_date);
        }
        if (req.query.end_date) {
            query += ' AND e.expense_date <= ?';
            params.push(req.query.end_date);
        }

        query += ' ORDER BY e.expense_date DESC, e.created_at DESC';

        const [rows] = await db.execute(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get recent expenses (limit 5)
router.get('/recent', async (req, res) => {
    try {
        const userId = req.query.user_id || 1;
        
        const query = `
            SELECT e.*, c.category_name 
            FROM expenses e 
            JOIN categories c ON e.category_id = c.category_id 
            WHERE e.user_id = ? 
            ORDER BY e.expense_date DESC, e.created_at DESC 
            LIMIT 5
        `;
        
        const [rows] = await db.execute(query, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get expense stats
router.get('/stats', async (req, res) => {
    try {
        const userId = req.query.user_id || 1;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        
        // Calculate start of week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

        // Total Expenses
        const [totalRows] = await db.execute(
            'SELECT SUM(amount) as total FROM expenses WHERE user_id = ?', 
            [userId]
        );
        const totalExpenses = totalRows[0].total || 0;

        // Monthly Expenses
        const [monthRows] = await db.execute(
            'SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?',
            [userId, currentMonth, currentYear]
        );
        const monthExpenses = monthRows[0].total || 0;

        // Weekly Expenses
        const [weekRows] = await db.execute(
            'SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND expense_date >= ?',
            [userId, startOfWeekStr]
        );
        const weekExpenses = weekRows[0].total || 0;
        
        // Total Entries
        const [countRows] = await db.execute(
            'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
            [userId]
        );
        const totalEntries = countRows[0].count || 0;

        res.json({
            success: true,
            data: {
                totalExpenses,
                monthExpenses,
                weekExpenses,
                totalEntries
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add new expense
router.post('/', async (req, res) => {
    const { title, amount, date, category, notes, user_id } = req.body;
    
    // Use proper user_id, fallback for testing
    const userId = user_id || 1;

    if (!title || !amount || !date || !category) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    try {
        await db.execute(
            'INSERT INTO expenses (user_id, category_id, title, amount, expense_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, category, title, amount, date, notes]
        );
        
        res.status(201).json({ success: true, message: 'Expense added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete expense
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.query.user_id || 1;
        const expenseId = req.params.id;

        const [result] = await db.execute(
            'DELETE FROM expenses WHERE expense_id = ? AND user_id = ?',
            [expenseId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
