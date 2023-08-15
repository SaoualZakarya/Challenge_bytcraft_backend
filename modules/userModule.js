const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    },
    taskId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
});

// hash the password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified) next()
    else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

// to check if the password matched when login user
userSchema.methods.isPasswordMatched = async function (entredPassword) {
    return await bcrypt.compare(entredPassword, this.password)
}

// we use to create reset password token when user forget the password
userSchema.methods.createPassowrdResetToken = async function () {
    try {
        // generate string as reset token
        const resetToken =  crypto.randomBytes(32).toString('hex')
        // We need to hash the resetToken before store it in the data base 
        this.passwordResetToken = await crypto.hash('sha256').update(resetToken).digest('hex')
        // just 10 min and the token will be expired
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000 
        // we return the resest token
        return resetToken
    } catch (err) {
        throw new Error(err)
    }
}


//Export the model
module.exports = mongoose.model('User', userSchema);