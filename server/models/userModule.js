const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")
const userSchema= new mongoose.Schema({
        name:{
                type:String,
                required:true
        },
        email:{ type:String,required:true},
        password:{type:String, required:true},
       
        pic:{
                type:String,
                required:true,
                default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" 
                        
        }
},{
        timestamps:true
})

//password hashing
userSchema.pre("save",async function(next){
        console.log("password is hashing");
        if(this.isModified("password")){
                this.password=await bcrypt.hash(this.password,12)
        }
        next();
})

const User =mongoose.model("User",userSchema)
module.exports =User;

