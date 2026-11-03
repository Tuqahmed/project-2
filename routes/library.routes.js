const router = require('express').Router()

router.get('/', (req,res)=>{
    res.render('library.ejs')
})

module.exports = router