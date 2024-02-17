const express =require("express");
const app=express();
const dotenv=require("dotenv")
// const chats=require("./data/data.js")
dotenv.config({path:"./config.env"})
const {notFound,errorHandler}=require("./middlewares/errorMiddleware.js")
//requiring conn.js file
require("./db/conn.js")

//to read json data
app.use(express.json());

//defining routes 
app.use("/api",require("./routes/userRoutes.js"))
app.use("/api",require("./routes/chatRoutes.js"))
app.use("/api",require("./routes/messageRoutes.js"))

//error handling middlewares
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT
 
const server=app.listen(PORT,()=>{
        console.log(`Server is running on port no ${PORT}`)
}) 
const io=require("socket.io")(server,{
        pingTimeout: 60000,
        cors: {
          origin: "http://localhost:3000",
          // credentials: true,
        },
})
// create a connection
io.on("connection",(socket)=>{
console.log("connected to socket.io");

// creating socket.on function for setup
// it will take the user data from the front-end
socket.on("setup",(userData)=>{

socket.join(userData._id)
// this has created a room for that particular user
console.log(userData._id);
socket.emit("connected")
})
// joining a chat(take roomId from the frontend)
socket.on("join chat",(room)=>{
socket.join(room);
console.log("User Joined Room: "+ room)
})

// socket for typing and stop typing
socket.on("typing",(room)=>socket.in(room).emit("typing"));
socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


// new socket 
socket.on("new message",(newMessageReceived)=>{
var chat=newMessageReceived.chat;

// if no user return it
if(!chat.users) return console.log("chat.users not defined");
 
// chat should be received by others but not the loggedin user
chat.users.forEach(user=>{
        //   if sent by us ,then return it 
        if(user._id == newMessageReceived.sender._id) return;

        // we are sending to (user._id) or inside the (user._id)'s room
        socket.in(user._id).emit("message received",newMessageReceived)
        // "in" means inside that user's room ,emit/send that message
})

})

// close the socket to reduce the use of bandwidth
socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
})
});
// userData === userId
// room ===chatId



// app.get("/api/chats",(req,res)=>{
//         // console.log(chats);
//         res.send(chats);
// })
//  app.get("/api/chats/:id",(req,res)=>{
//         console.log(req.params.id)
//         const singleChat =chats.find((c)=>{c._id === req.params.id});
//         res.send(singleChat)
//  })