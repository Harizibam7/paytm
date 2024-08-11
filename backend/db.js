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
        maxLength:50
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


//Model for Account Schema
const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },balance:{
        type:Number,
        required:true,
    }
});

//Create a Model from the schema
const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User',userSchema);

module.exports = {
    User,
    Account
};