import jwt from 'jsonwebtoken'

// user authentication middleware

const authdoc=async(req,res,next)=>{
    try{
        const  {doctoken}=req.headers
        if(!doctoken){
            return res.json({success:false,message:"you are not logged in"})
        }
        const decodetoken=jwt.verify(doctoken,process.env.JWT_SECRET);
        req.doc={docid:decodetoken.id};
        next();
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

export default authdoc;