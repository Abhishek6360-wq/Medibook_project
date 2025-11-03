import jwt from 'jsonwebtoken'

// user authentication middleware

const authuser=async(req,res,next)=>{
    try{
        const  {usertoken}=req.headers
        if(!usertoken){
            return res.json({success:false,message:"you are not logged in"})
        }
        const decodetoken=jwt.verify(usertoken,process.env.JWT_SECRET);
        req.user={userid:decodetoken.id};
        // console.log(req.user.userid)
        next();
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

export default authuser