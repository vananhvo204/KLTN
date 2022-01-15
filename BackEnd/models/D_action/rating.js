const mongoose = require('mongoose');
// const reply = require('./reply');
const ratingSchema = mongoose.Schema({
    cakeID: String,
    userID: String,
    star: String,
    review: String,
    createdAt: String,
    // replies: [reply]
});

module.exports = mongoose.model('ratings', ratingSchema);