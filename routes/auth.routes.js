const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");


// Sign up routes
router.get("/sign-up", (req, res) => {
  try{
  res.render("auth/sign-up.ejs");
  }
  catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
});

router.post("/sign-up", async (req, res) => {
  try{
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // validation logic

  const user = await User.create(req.body);
  res.redirect("/auth/sign-in");
  }
  catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
});



// Sign in routes
router.get("/sign-in", (req, res) => {
  try{
  res.render("auth/sign-in.ejs");
  }
  catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
});



router.post("/sign-in", async (req, res) => {
  try{
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/");
  }
  catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
});


router.get("/sign-out", (req, res) => {
  try{
  req.session.destroy();
  res.redirect("/");
  }
  catch(error){
        req.session.toast = {
        type: 'error',
        message: 'Something went wrong'
    }
    res.redirect('/')
    }
});





module.exports = router;
