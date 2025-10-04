const express = require('express');
const router = express.Router();

const Account = require('../models/AccountModel');

router.delete('/delete-account1', (req, res) => {
    let body = req.body;

    // if body is empty, try parsing the raw text
    if (!body || Object.keys(body).length === 0) {
        body = JSON.parse(req.rawBody || '{}'); // only if you store raw body
    }

    const username = body.username;

    try {
        Account.findOneAndDelete({ username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;