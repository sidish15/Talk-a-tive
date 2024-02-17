//1.Name or id of sender
//2.content
//3.reference to chat which is belongs to

const mongoose=require("mongoose");
const messageModel= new mongoose.Schema({
        sender:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
        },
        content:{
                type:String,
                trim:true
        },
        chat:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Chat"
        }
},
{
        timestamps:true
}
)

const Message=mongoose.model("Message",messageModel)
module.exports=Message;