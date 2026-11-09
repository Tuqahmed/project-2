// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./db.js')
const Author = require('./models/Author.js')
const Genre = require('./models/Genre.js')
const User = require('./models/User.js')

// middleware imports
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// routes Imports
const authController = require("./routes/auth.routes.js");
const indexController = require("./routes/index.routes.js");
const libraryRoutes = require('./routes/library.routes.js');
const Status = require("./models/Status.js");
const Rating = require('./models/Rating.js');
const Book = require("./models/Book.js");


// Middleware
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(passUserToView)
app.use((req,res,next)=>{
  res.locals.toast = req.session.toast
  delete req.session.toast
  next()
})

app.use(async (req,res,next)=>{
  res.locals.authors = await Author.find()
  res.locals.genres = await Genre.find()
  res.locals.statuses = await Status.find()
  res.locals.ratings = await Rating.find()
  res.locals.users = req.session.user ? await User.findById(req.session.user._id).select('username profilePicture') : null
  next()
})










// Routes go here
app.use('/auth',authController)
app.use('/', indexController)
app.use('/library', libraryRoutes)

app.get('/users/:userId', async (req,res)=>{
  try{
    const foundUser = await User.findById(req.params.userId)
    
    const books = await Book.find({owner: foundUser._id}).populate('author')

    res.render('profile.ejs', {foundUser, books})
  }
  catch(error){
    res.redirect('/')
  }
})

app.put('/users/:userId', isSignedIn, async (req,res)=>{
  await User.findByIdAndUpdate(req.params.userId, {
    profilePicture: req.body.profilePicture,
    about: req.body.about
  })

  res.redirect(`/users/${req.params.userId}`)
})



// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();