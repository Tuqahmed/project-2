const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in");
const Book = require('../models/Book')


router.get('/', async (req,res)=>{
    const allBooks = await Book.find().populate('owner author genre')
    res.render('homepage.ejs', {books: allBooks})
})
module.exports = router;
