const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true,
        trim: true, 
        maxlength: 500
    }
}, {timestamps: true})

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    coverImg: {
        type: String
    },
    publicationYear: {
        type: Number
    },
    status:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
    },
    rating:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    },
    review: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema],
}, {timestamps: true})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book