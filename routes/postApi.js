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

    // if body is empty, try parsing the raw text
    if (!body || Object.keys(body).length === 0) {
        body = JSON.parse(req.rawBody || '{}'); // only if you store raw body
    }

    const username = body.username;
    const password = body.password;

    try {
        let existingAccount = await Account.findOne({ username, password });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Server error'});
    }

    const newAccount = new Account({ username, password, levels_completed: 0 });

    try {
        await newAccount.save();
        res.status(201).json({ message: 'Account created successfully', newAccount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/update-data1', (req, res) => {
    let body = req.body;

    // if body is empty, try parsing the raw text
    if (!body || Object.keys(body).length === 0) {
        body = JSON.parse(req.rawBody || '{}'); // only if you store raw body
    }

    const username = body.username;
    const levels_completed = body.levels_completed;

    try {
        Account.findOneAndUpdate({ username }, { levels_completed }, { new: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
})

module.exports = router;