const express = require('express');
const router = express.Router();

const Account = require('../models/AccountModel');

router.post('/login', async (req, res) => {
    let body = req.body;

    // if body came as a string (like from GML), parse it
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (err) {
            console.error('❌ Invalid JSON body:', err);
            return res.status(400).json({ message: 'Invalid JSON format' });
        }
    }

    // if body still empty somehow
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ message: 'Missing request body' });
    }

    const { username, password } = body;

    try {
        const account = await Account.findOne({ username, password });

        if (!account) {
            return res.status(401).json({ 
                message: 'Invalid credentials', 
                data_sent: body 
            });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            account 
        });

    } catch (err) {
        console.error('⚠️ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    let body = req.body;

    // parse if raw text (GML)
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

    const { username, password } = body;

    try {
        const existingAccount = await Account.findOne({ username, password });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const newAccount = new Account({ username, password, levels_completed: 0 });
        await newAccount.save();

        res.status(201).json({ message: 'Account created successfully', newAccount });
    } catch (err) {
        console.error('⚠️ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/update-data1', async (req, res) => {
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

    const { username, levels_completed, password, secret_key } = body;

    if (secret_key !== process.env.SECRET_KEY) {
        return res.status(403).json({ message: `1: ${secret_key}, 2: ${process.env.SECRET_KEY}` });
    }

    try {
        const updated = await Account.findOneAndUpdate(
            { username },
            password === undefined ? { levels_completed } : { password },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json({ message: 'Data updated successfully', updated });
    } catch (err) {
        console.error('⚠️ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;