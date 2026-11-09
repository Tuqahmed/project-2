const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in");
const Book = require('../models/Book')


router.get('/', async (req,res)=>{
    try{
    const allBooks = await Book.find().populate('owner author genre')
    res.render('homepage.ejs', {books: allBooks})
    }
    catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
})
module.exports = router;
