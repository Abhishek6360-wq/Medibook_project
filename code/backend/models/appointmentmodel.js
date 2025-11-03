import mongoose from "mongoose";


const appointmentschema=new mongoose.Schema(
    {
        UserId:{
            type:String,
            required:true
        },
        DocId:{
            type:String,
            required:true
        },
        slotDate:{
            type:String,
            required:true
        },
        slotTime:{
            type:String,
            required:true
        },
        userData:{
            type:Object,
            required:true
        },
        docData:{
            type:Object,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        date:{
            type:Number,
            required:true,
        },
        cancelled:{
            type:Boolean,
            default:false
        },
        payment:{
            type:Boolean,
            default:false
        },
        isComplete:{
            type:Boolean,
            default:false
        }
    }
)

const appointmentmodel=mongoose.models.appointment || mongoose.model('appointment',appointmentschema);

export default appointmentmodel;