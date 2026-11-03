const isSignedIn = require('../middleware/is-signed-in')
const Book = require('../models/Book')
const router = require('express').Router()
const Author = require('../models/Author')
const Genre = require('../models/Genre')

router.get('/', async (req,res)=>{
    const allBooks = await Book.find().populate('owner author')
    res.render('library.ejs', {books: allBooks})
})

router.get('/new',isSignedIn, (req,res)=>{
    res.render('add-book.ejs')
})

router.post('/', isSignedIn, async (req,res)=>{
    const author = await Author.create({
        name: req.body.author
    })
    const genre = await Genre.create({
        name: req.body.genre
    })
    const createdBook = await Book.create({
        title: req.body.title,
        author: author._id,
        genre: genre._id,
        coverImg: req.body.coverImg,
        publicationYear: req.body.publicationYear,
        owner: req.session.user._id
    })
    res.redirect('/library')
})

module.exports = router