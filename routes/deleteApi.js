const express = require('express');
const router = express.Router();

const Account = require('../models/accountModel');

router.delete('/delete-account1', (req, res) => {
    const { username } = req.body;

    try {
        Account.findOneAndDelete({ username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;