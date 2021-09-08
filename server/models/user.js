const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SALT_I = 10;


const userSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'invalid email']
   },
   password: {
      type: String,
      required: true,
      minlength: 5
   },
   name: {
      type: String,
      maxlength: 100
   },
   lastname: {
      type: String,
      maxlength: 100
   },
   token: {
      type: String
   }

});

userSchema.pre('save', function (next) {
   var user = this;
   if (user.isModified('password')) {
      bcrypt.genSalt(SALT_I, function (err, salt) {
         if (err) return next(err);

         bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
         })
      });
   } else {
      next()
   }
});

userSchema.methods.generateToken = async function () {
   var user = this;
   var token = jwt.sign({ email: user.email }, process.env.SECRET, {
      expiresIn: '7d'
   });

   user.token = token;
   return user.save();
}

userSchema.methods.comparePassword = function (candidatePassword) {
   var user = this;
   //bcrypt uses Promises
   return bcrypt.compare(candidatePassword, user.password).then(function (result) {
      return result
   });
}


const User = mongoose.model('User', userSchema);
module.exports = { User }