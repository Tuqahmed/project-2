const isSignedIn = require('../middleware/is-signed-in')
const Book = require('../models/Book')
const router = require('express').Router()
const Author = require('../models/Author')
const Genre = require('../models/Genre')
const Status = require('../models/Status')
const Rating = require('../models/Rating')

router.get('/', async (req,res)=>{
    try{
    const filter = {}
    if(req.query.search) filter.title = {$regex: req.query.search, $options: 'i'}
    const allBooks = await Book.find(filter).populate('owner author')
    res.render('library.ejs', {books: allBooks})
    }
    catch(error){
        res.send('Something went wrong')
    }
})

router.get('/new',isSignedIn, async (req,res)=>{
    try{
    const genres = await Genre.find()
    const authors = await Author.find()
    const statuses = await Status.find()
    const ratings = await Rating.find()
    res.render('add-book.ejs', {genres, authors, statuses, ratings})
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.post('/', isSignedIn, async (req,res)=>{
    try{
    const createdBook = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        coverImg: req.body.coverImg,
        publicationYear: req.body.publicationYear,
        status: req.body.status,
        rating: req.body.rating,
        review: req.body.review,
        owner: req.session.user._id
    })
    req.session.toast = {
        type: 'success',
        message: 'Book added'
    }
    res.redirect('/library')
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.get('/authors', async (req,res)=>{
    try{
    const allBooks = await Book.find()
    const allAuthors = await Author.find()
    res.render('authors.ejs', {authors: allAuthors, books: allBooks})
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.get('/genres', async (req,res)=>{
    try{
    const allBooks = await Book.find()
    const allGenres = await Genre.find()
    res.render('genres.ejs', {books: allBooks, genres: allGenres})
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.get('/:bookId', async (req,res)=>{
    try{
    const foundBook = await Book.findById(req.params.bookId).populate('owner author genre status rating comments.author')
    res.render('book-details.ejs', {book: foundBook})
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.put('/:bookId', isSignedIn, async (req,res)=>{
    try{
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId,{
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        coverImg: req.body.coverImg,
        publicationYear: req.body.publicationYear,
        status: req.body.status,
        rating: req.body.rating,
        review: req.body.review
    })
    req.session.toast = {
        type: 'success',
        message: 'Book updated'
    }
    res.redirect('/library')
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})


router.delete('/:bookId', isSignedIn, async (req,res)=>{
    try{
    const foundBook = await Book.findById(req.params.bookId)
    if(!foundBook.owner.equals(req.session.user._id)){
        return res.send('Action is not allowed')
    }
    await Book.findByIdAndDelete(req.params.bookId)
    req.session.toast = {
        type: 'success',
        message: 'Book deleted'
    }
    res.redirect('/library')
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.get('/', async(req,res)=>{
    try{
    const searchedBook = await Book.find(req.params.search)
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})

router.post('/:bookId/comments', isSignedIn, async (req,res)=>{
    try{
    const content = (req.body.content || '').trim()
    if(content){
        const book = await Book.findById(req.params.bookId)
        book.comments.push({
            author: req.session.user._id,
            content
        })
        await book.save()
    }
    res.redirect(`/library/${req.params.bookId}`)
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})



module.exports = router