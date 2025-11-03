import mongoose from "mongoose";

const docschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"this field is required"]
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
    speciality:{
        type:String,
        required:[true,"this field is required"],
    },
    image:{
        type:String,
        required:[true,"this field is required"],
    },
    experience:{
        type:String,
        required:[true,"this field is required"],
    },
    degree:{
        type:String,
        required:[true,"this field is required"],
    },
    phnum:{
        type:String,
        required:[true,"this field is required"]
    },
    available:{
        type:Boolean,
        default:true,
    
    },
    about:{
        type:"String",
        required:true
    },
    fees:{
        type:Number,
        required:[true,"this field is required"]
    },
    address:{
        type:Object,
        required:[true,"this field is required"]
    },
    slots_booked:{
        type:Object,
        default:{}
    },
    date:{
        type:Number,
        required:[true,"this field is required"]
    }
},{minimize:false})

const docmodel=mongoose.models.doctor || mongoose.model('doctor',docschema);

export default docmodel;