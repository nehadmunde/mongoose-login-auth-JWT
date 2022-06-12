import jwt from "jsonwebtoken";
import userModel from "../models/user.js"

var checkUserAuth=async (req,res,next)=>{
    let token;
    const {autherization} = req.headers
    if(autherization && autherization.startsWith('Bearer')){
      try{
        token=autherization.split(' ')[1]
        console.log("token",token)
        //verify token
        const {userID}=jwt.verify(token,process.env.JWT_SECRATE_KEY)
  
    //get user from token
    req.user= await userModel.findById(userID).select("-password")
    console.log("user",req.user)
    next()    
     }catch(err){
        console.log(err)
        res.send({"status":"failed","message":"Unautherized user."})
      }
      if(!token){
        res.send({"status":"failed","message":"Unautherized user ,token not found."})
      }
    }
}

export default checkUserAuth