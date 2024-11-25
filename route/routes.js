const express = require('express');
const db = require('../mySQL/db'); // Import koneksi database

const router = express.Router();

// Endpoint untuk menyimpan data
router.post('/userdata', (req, res) => {
    const { age, gender, bedTime, wakeupTime } = req.body;

    // Validasi input
    if (!age || !gender || !bedTime || !wakeupTime) {
        return res.status(400).json({ error: 'Semua field harus diisi!' });
    }

    const query = 'INSERT INTO users (age, gender, bedTime, wakeupTime) VALUES (?, ?, ?)';
    db.query(query, [age, gender, bedTime, wakeupTime], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        res.status(201).json({ message: 'Data berhasil disimpan!', id: result.insertId });
    });
});

module.exports = router;
