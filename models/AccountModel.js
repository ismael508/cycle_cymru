const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
    username: String,
    password: String,
    levels_completed: Number
}, { timestamps: true })

const Account = mongoose.model('Account', accountSchema, 'accounts')

module.exports = Account