import React, { useState } from 'react'
import { FormControl, FormLabel,useToast} from '@chakra-ui/react'
import {Button} from "@chakra-ui/button"
import {Input,InputGroup ,InputRightElement} from "@chakra-ui/input";
import {VStack} from "@chakra-ui/layout";
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const Login = () => {
   const navigate=useNavigate();
   const [show,setShow]=useState(false);
   const handleClick=()=>setShow(!show)
   const toast = useToast();
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [loading, setLoading] = useState(false);
 

const submitHandler=async()=>{
setLoading(true);
if(!email || !password){
   toast({
      title: 'Please Fill all the Fiels!',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "bottom"
    });
    setLoading(false);
    return ;
}
try{
   const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/login",
      { email, password },
      config
    );

    // console.log(JSON.stringify(data));
    toast({
      title: "Login Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    navigate("/chats")

}catch(error){
   toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
}

}

const postDetails=(pics)=>{

}
  return (
        <VStack spacing="5px" >
        
        <FormControl id='email'>
           <FormLabel> Email </FormLabel>
           <Input 
           type='text'
           placeholder="Enter Your E-Mail"
           onChange={(e) => setEmail(e.target.value)}
           value={email}
           />
        </FormControl>
        <FormControl id='password'>
           <FormLabel> Password </FormLabel>
         <InputGroup>
           <Input 
           type={show ? "text" :"password"}
           placeholder="Enter Your Password"
           onChange={(e) => setPassword(e.target.value)}
           value={password}
           />
           <InputRightElement>
           <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" :"Show"}
           </Button>
           </InputRightElement>
         </InputGroup>
        </FormControl>
        
         
        <Button
        colorScheme='blue'
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
     Login
        </Button>
        <Button
        variant="solid"
        colorScheme='red'
        width="100%"
        color="white"
        onClick={()=>{
         setEmail("guest@example.com")
         setPassword("123456")
        }
       }
        >
        Get Guest User Credentials
        </Button>
      
    </VStack>
  )
}

export default Login
