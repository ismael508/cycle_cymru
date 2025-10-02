const express = require('express');
const router = express.Router();

const Account = require('../models/accountModel');

router.get('/leaderboard', async (req, res) => {
    try {
        const accounts = await Account.find()
            .sort({ levels_completed: -1 })
            .limit(5);
        res.json({ leaderboard: accounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;