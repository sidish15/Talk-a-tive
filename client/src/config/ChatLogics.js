// this function is gonna leave the loggedin user and returns us a user which is not logged in from the users array
export const getSender=(loggedUser,users)=>{
return         users[0]._id===loggedUser._id ? users[1].name :users[0].name;

}
export const getSenderFull=(loggedUser,users)=>{
        return         users[0]._id===loggedUser._id ? users[1]:users[0];
        
        }
        

//users is the element that contains both the user of a singlechat(id)

// isSameSender
// userId:logged in
// m:current msg
// i:index of a current msg
export const isSameSender=(messages,m,i,userId)=>{
return (
        i< messages.length -1 && 
        (messages[i+1].sender._id !==m.sender._id ||
                messages[i+1].sender._id ===undefined ) 
                &&
                // checking if the cur msg is not equal to the userId(loggedIN)
        messages[i].sender._id !==userId

  )
}

// isLastMessage
export const isLastMessage=(messages,i,userId)=>{
        return(
                i===messages.length-1 && 
                messages[messages.length-1].sender._id !==userId &&
                messages[messages.length-1].sender._id
        )
}
// isSameSenderMargin
// if its the same sender who is loggedIN then return 33 margin
export const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 33;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
      };
// isSameUser(For creating some separation between the messages sent by same user)
export const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
      };
      