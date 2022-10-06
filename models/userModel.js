const mongoose = require('mongoose');

const UserDetails = new mongoose.Schema({
   username: {type: String, required: true},
   email: {type: String, required: true},
   password: {type: String, required: true},
   confirmpassword: {type: String, required: true} 
},{
    timestamps: true
})

const model = mongoose.model('UserDetails', UserDetails)

module.exports = model;