const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://i.pinimg.com/474x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg?nii=t'
  },
  about: {
    type: String,
    maxlength: 300,
    default: ''
  },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
