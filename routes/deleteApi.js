const express = require('express');
const router = express.Router();

const Account = require('../models/AccountModel');

router.delete('/delete-account1', async (req, res) => {
    let body = req.body;

    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (err) {
            console.error('❌ Invalid JSON body:', err);
            return res.status(400).json({ message: 'Invalid JSON format' });
        }
    }

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ message: 'Missing request body' });
    }

    const { username, secret_key } = body;

    if (secret_key !== process.env.SECRET_KEY) {
        return res.status(403).json({ message: 'Invalid secret key' });
    }

    try {
        const deleted = await Account.findOneAndDelete({ username });

        if (!deleted) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json({ message: 'Account deleted successfully', deleted });
    } catch (err) {
        console.error('⚠️ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;