const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: String,
    trim: true
}, {timestamps: true})

const Genre = mongoose.model('Genre', genreSchema)

module.exports = Genre