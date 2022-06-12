import userModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController{

    //user registraion controller
static userRegistraion=async (req,res)=>{
    console.log(req.body)
    const {name,email,password,password_confirmation,tc}=req.body
    const user=await userModel.findOne({email:email})
    console.log("user data",user);
    if(user){ //user allready exist
        res.send({"status":"failed","message":"Email already exists.."})
    }
    else{
        if(name && email && password && password_confirmation && tc){ // checking all feild are having value
           if(password === password_confirmation){ //checking password match with confirm password
            try{  
            const salt=await bcrypt.genSalt(10)  // no added in hashing
            const hashPass=await bcrypt.hash(password,salt)
            const doc=new userModel({
                name:name,
                email:email,
                password:hashPass,// no need to add password confirmation
                tc:tc
              })
              await doc.save()
              const savedUser=await userModel.findOne({email:email})
              //genrate jwt token
              const token=jwt.sign({userID:savedUser._id},process.env.JWT_SECRATE_KEY,{expiresIn:"5d"})
              //{expiresIn:"5d"} ==> expires in 5 days (m=> min)
              console.log("token",token)
              res.send({"status":"Sucess","message":"Registration Sucessfull.","token":token})
            }catch(err){
                console.log(err)
                res.send({"status":"failed","message":"Unable to register ."})
            }
           }
           else{
            res.send({"status":"failed","message":"Password and confirm password doesnt match ."})
           }
        }
        else{
            res.send({"status":"failed","message":"All filds are required."})
        }
    }
}

static userLogin=async (req,res)=>{
    console.log(req.body)
    const {email,password}=req.body
    try{
    if(email && password){
        const user=await userModel.findOne({email:email})
        console.log("user data",user);
        if(user!=null){
          const isMatch=await bcrypt.compare(password,user.password)
          if((user.email === email) && isMatch){
              //genrate jwt token
              const token=jwt.sign({userID:user._id},process.env.JWT_SECRATE_KEY,{expiresIn:"5d"})
              //{expiresIn:"5d"} ==> expires in 5 days (m=> min)
              console.log("token",token)
            res.send({"status":"sucess","message":"Login sucessfull.","token":token})
          }else{
            res.send({"status":"failed","message":"E-mail or Password is not valid."})
          }
        }else{
            res.send({"status":"failed","message":"You are not a registered user."})
        }
    }else{
        res.send({"status":"failed","message":"All filds are required."})
    }
    }catch(err){
        console.log(err)
        res.send({"status":"failed","message":"Unable to login."})
    }
}

static userResetPassword=async (req,res)=>{
    const{password,password_confirmation}=req.body
    if(password && password_confirmation){
      if(password !== password_confirmation){
        res.send({"status":"failed","message":"Password and Confirm password does not match."})
      }else{
        const salt=await bcrypt.genSalt(10)  // no added in hashing
            const newHashPass=await bcrypt.hash(password,salt)
            console.log(req.user)
            res.send({ "status": "success", "message": "Password changed succesfully" })
      }
    }else{
        res.send({"status":"failed","message":"All feilds are required."})
    }
}

}

export default UserController
