const isSignedIn = require('../middleware/is-signed-in')
const Book = require('../models/Book')
const router = require('express').Router()
const Author = require('../models/Author')
const Genre = require('../models/Genre')

router.get('/', async (req,res)=>{
    const allBooks = await Book.find().populate('owner author')
    res.render('library.ejs', {books: allBooks})
})

router.get('/new',isSignedIn, async (req,res)=>{
    const genres = await Genre.find()
    const authors = await Author.find()
    res.render('add-book.ejs', {genres, authors})
})

router.post('/', isSignedIn, async (req,res)=>{
    const createdBook = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        coverImg: req.body.coverImg,
        publicationYear: req.body.publicationYear,
        review: req.body.review,
        owner: req.session.user._id
    })
    res.redirect('/library')
})

router.get('/authors', async (req,res)=>{
    const allBooks = await Book.find()
    const allAuthors = await Author.find()
    res.render('authors.ejs', {authors: allAuthors, books: allBooks})
})

router.get('/genres', async (req,res)=>{
    const allBooks = await Book.find()
    const allGenres = await Genre.find()
    res.render('genres.ejs', {books: allBooks, genres: allGenres})
})

router.get('/:bookId', async (req,res)=>{
    const foundBook = await Book.findById(req.params.bookId).populate('owner author genre')
    res.render('book-details.ejs', {book: foundBook})
})

router.get('/:bookId/edit', isSignedIn, async (req,res)=>{
    const foundBook = await Book.findById(req.params.bookId).populate('owner author genre')
        const genres = await Genre.find()
    const authors = await Author.find()

    res.render('edit-book.ejs', {book: foundBook, genres, authors})
})

router.put('/:bookId', isSignedIn, async (req,res)=>{
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId,{
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        coverImg: req.body.coverImg,
        publicationYear: req.body.publicationYear,
        review: req.body.review
    })
    res.redirect('/library')
})


router.delete('/:bookId', isSignedIn, async (req,res)=>{
    const foundBook = await Book.findById(req.params.bookId)
    if(!foundBook.owner.equals(req.session.user._id)){
        return res.send('Action is not allowed')
    }
    await Book.findByIdAndDelete(req.params.bookId)
    res.redirect('/library')
})


module.exports = router