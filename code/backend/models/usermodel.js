import mongoose from "mongoose";

const userschema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"this field is required"],
        
    },
    email:{
        type:String,
        required:[true,"this field is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"this field is required"],
        min:[8,"password must have a minimum length of 8"],
        max:[16,"password must not exceed length of 16"],
    },
   
    image:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fprofile-picture_12225881&psig=AOvVaw3ZNBwWEzbhY0DUKSpl_ltv&ust=1759737646387000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNj339zLjJADFQAAAAAdAAAAABAK"
    },

    phno:{
        type:String,
        required:[true,"this field is required"],
        default:"000000000"
    },

    Address:{
        type:Object,
        required:[true,"this field is required"],
        default:{
            line1:"",
            line2:""
        }
    },

    date:{
        type:Number,
        required:[true,"this field is required"],
        default:Date.now
    },
    gender:{
        type:String,
        default:"not selected"
    },
    dob:{
        type:String,
        default:"not selected"
    }
},)

const usermodel=mongoose.models.user || mongoose.model('user',userschema);

export default usermodel;