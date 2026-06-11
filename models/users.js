const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;

// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    }
});

// Passport-Local Mongoose adds some methods to your Schema such as 
// 1. SetPassword(password, [cb])
// Sets a user password. Does not save the user object, If no callback cb is provided a Promise is returned.

// 2. changePassword(oldPassword, newPassword, [cb])
// Changes a user's password hash and salt, resets the user's number of failed password attempts and saves the user 
// object (everything only if oldPassword is correct). If no callback cb is provided a Promise is returned. 
// If oldPassword does not match the user's old password, an IncorrectPasswordError is passed to cb or the Promise is rejected.

// 3. authenticate(password, [cb])
// Authenticates a user object. If no callback cb is provided a Promise is returned.

// 4. resetAttempts([cb])
// Resets a user's number of failed password attempts and saves the user object. 
// If no callback cb is provided a Promise is returned. This method is only defined if options.limitAttempts is true.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);