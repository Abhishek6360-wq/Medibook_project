import jwt from 'jsonwebtoken'

// admin authentication middleware

const authadmin=async(req,res,next)=>{
    try{
        const  {admintoken}=req.headers
        if(!admintoken){
            return res.json({success:false,message:"you are not uthorised kindly login "})
        }
        const decodetoken=jwt.verify(admintoken,process.env.JWT_SECRET);
        if(decodetoken!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"you are not authorised kindly login "})
        }
        next();
    }catch(err){
        console.log(err);
        res.json({sucess:false,message:err.message})
    }
}

export default authadmin