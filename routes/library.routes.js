const isSignedIn = require('../middleware/is-signed-in')

const router = require('express').Router()

router.get('/', (req,res)=>{
    res.render('library.ejs')
})

router.get('/new',isSignedIn, (req,res)=>{
    res.render('add-book.ejs')
})

module.exports = router