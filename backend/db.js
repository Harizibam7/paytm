const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");

//Schema for User Data
const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique: true,
        trim:true,
        lowercase:true, 
        minLength:3,
        maxLength:10
    },
    password:{
        type:String, 
        required:true,
        minLength:6
    },
    firstName:{
        type:String, 
        required:true, 
        unique:true,
        trim:true,
        lowercase:true,  
        maxLength:50
    },
    lastName:{
        type:String, 
        required:true,
        trim:true,
        unique:true, 
        maxLength:50
    }
});



//Create a Model from the schema
const User = mongoose.model('User',userSchema);

module.exports = {
    User
};