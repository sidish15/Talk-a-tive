const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const router=express.Router();
const Message=require("../models/messageModel.js");
const User = require("../models/userModule");
const Chat = require("../models/chatModule");
//route for sending a msg
//things required:1.ChatId,2.actual msg (they will take from the body)
// 3.sender (from middleware)
router.post("/message",protect,async(req,res)=>{
const {content,chatId}=req.body;
// validation
if(!content ||!chatId){
        console.log("Invalid data passed into request")
        return res.status(400)
}
var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
}

try {
        
        var message=await Message.create(newMessage);
        // since this is not directly being populated but instance of mongoose class
        message=await message.populate("sender","name pic")
        message=await message.populate("chat")
        // now we are populating users array inside Chat Module(DOUBT!!!!)
        message= await User.populate(message,{
                path:"chat.users",
                select:"name pic email"
        }) 

       //find by id and update the chat with the latest msg
       await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });


       res.json(message);


} catch (error) {
        res.status(400);
        throw new Error(error.message)
}
})
//route for fetch all of the msg in a particular chat
router.get("/message/:chatId",protect,async(req,res)=>{
try {
       const messages= await Message.find({chat:req.params.chatId}).populate(
        "sender",
        "name pic email"
       ).populate("chat")

       res.json(messages);

} catch (error) {
        res.status(400);
        throw new Error(error.message);
}
})

module.exports=router;