const express=require("express");
const router=express.Router();
// const {body,validationResult}=require("express-validator")
const User=require("../models/userModule")
const generateToken=require("../db/generateToken")
const bcrypt=require("bcryptjs")
const {protect}=require("../middlewares/authMiddleware")

//registraion
router.post("/register",async (req,res)=>{
      
        try{
        const {name,email,password,pic} =req.body;
        if(!name || !email || !password ){
                res.status(400);
                throw new Error("Please Enter all the fields")
        }
      const UserExists=await User.findOne({email:email});
      if(UserExists){
        res.status(400);
        throw new Error("User already exists");
      }
      const user=new User({name,email,password,pic});
      console.log(user)
      const registered=await user.save()
      console.log(registered);
      if(registered) res.status(201).json(
        {
                 _id:registered._id,
                 name:registered.name,
                 email:registered.email,
                 pic:registered.pic,
                 token:generateToken(registered._id)
        }
      );
      else{
        res.status(400).json({message:"failed to create the user"})
      }

        }catch(err){
                console.log("error",err)
                res.status(500).json({message:"Internal error"})
        }
}
)

//login part
router.post("/login",async(req,res)=>{
try{
const {email,password}=req.body;
const user=await User.findOne({email:email});
console.log("user",user)
if(!user){
return res.status(404).send({message:"User Not Found"})
}else{
  const isMatched=await bcrypt.compare(password,user.password);
  console.log(isMatched)
  if(!isMatched) return res.status(400).json({message:"Invalid Credentials"})
  else{
    return res.status(200).json({
      _id:user._id,
                 name:user.name,
                 email:user.email,
                 pic:user.pic,
                 token:generateToken(user._id)
    })
  }
}


}catch(err){
  console.log("error",err);
  res.status(500).json({message:"Internal Error"})
}
})

//search user API
// /api/user?search=virat
//data can be send to backend from frontend using post request or queries
router.get("/user",protect,async(req,res)=>{
const keyword=req.query.search ? {
$or:[
  {name:{ $regex:req.query.search,$options:"i"}},
  {email:{ $regex:req.query.search,$options:"i"}},

]
}: {};
console.log(req.user)
//req.user k andar poora object aajayega
const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
res.send(users)
//now we have got search result inside keyword


console.log(keyword)
})

module.exports=router;




