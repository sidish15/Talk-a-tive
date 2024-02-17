import { FormControl, FormLabel, useToast } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const SignUp = () => {
  const navigate=useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show)
  const toast = useToast()
  
  const[name,setName]=useState();
  const[email,setEmail]=useState();
  const[password,setPassword]=useState();
  const[cpassword,setCpassword]=useState();
  const [pic, setPic] = useState();
  //state for uploading state
  const [loading, setLoading] = useState(false)

  
//   const handleInputs = (e) => {
// name=e.target.name;
// value=e.target.value;
// setUser((preValue)=>{
// return{
//   ...preValue,
//   [name]:value
// }

  
  const submitHandler = async() => {
    try{
      setLoading(true);
      //checks if any of the fields is filled or not
  if(!name || !email ||!password ||!cpassword){
    toast({
      title: 'Please Fill all the Fiels!',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "bottom"
    });
    return ;
  }
  //checks if both of the password match or not
  if(password !==cpassword){
    toast({
      title: 'Passwords do not match!',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "bottom"
    });
    return ;
  }
  console.log(name,email,password,pic)
const config={
  headers:{
    "Content-type":"application/json",
  },
};
const {data}=await axios.post("/api/register",
{
  name,
  email,
  password,
  pic,
},
config);
console.log(data);


  toast({
    title: 'Registration Successful !',
    status: 'success',
    duration: 5000,
    isClosable: true,
    position: "bottom"
  });
  localStorage.setItem("userInfo",JSON.stringify(data));
  setLoading(false);
navigate("/")


}catch(err){
  toast({
    title: "Error Occured!",
    description: err.response.data.message,
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom",
  });
  setLoading(false);
}

  }

  //for uploading the pictures
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "drlhogyrm");
      axios.post("https://api.cloudinary.com/v1_1/drlhogyrm/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
    }

  }

  return (
    <VStack spacing="5px" >
      <FormControl id='first-name'>
        <FormLabel> Name </FormLabel>
        <Input
          type='text'
          placeholder="Enter Your Name"
         
          onChange={(e) => setName(e.target.value)}
         
        />
      </FormControl>
      <FormControl id='email'>
        <FormLabel> Email </FormLabel>
        <Input
          type='text'
          placeholder="Enter Your E-Mail"
          onChange={(e) => setEmail(e.target.value)}
          
        />
      </FormControl>
      <FormControl id='password'>
        <FormLabel> Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
          
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='password'>
        <FormLabel> Confirm Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
           
            onChange={(e) => setCpassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel> Upload your Picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />

      </FormControl>
      <Button
        colorScheme='blue'
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>

    </VStack>
  )
}

export default SignUp
