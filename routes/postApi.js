const express = require('express');
const router = express.Router();

const Account = require('../models/AccountModel');

router.post('/login', async (req, res) => {
    username = req.body.username;
    password = req.body.password;

    try {
        let account = await Account.findOne({username, password});
        if (!account){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        res.status(200).json({message: 'Login successful', account});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

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
    const { username, levels_completed } = req.body;

    try {
        Account.findOneAndUpdate({ username }, { levels_completed }, { new: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
})

module.exports = router;