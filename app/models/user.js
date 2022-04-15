const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        minlength: 6,
        maxlength: 64,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        validate: {
            validator: function(value){
                return isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }
    }, 
    password: {
        type: String, 
        required: String,
        minlength: 8,
        maxlength: 128
    },
     phone: {
        type: String, 
        required: String,
        minlength: 10,
        maxlength: 128
    },
    lastActive :{
        type :String,
        required : true,
    },
    active : {
        type:Boolean,
        default:false
    },
    otp: DataTypes.STRING,
        expiration_time: DataTypes.DATE,
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true
        },
    

});

const User = mongoose.model('User', userSchema)

module.exports = User