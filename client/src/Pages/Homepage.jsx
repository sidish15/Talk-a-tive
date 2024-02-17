import React, { useEffect } from 'react'
import {Container,Box,Text,Tab,TabList,TabPanel,TabPanels,Tabs} from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import Login from '../components/authentication/Authentication/Login'
import SignUp from '../components/authentication/Authentication/SignUp'
const Homepage = () => {
const navigate=useNavigate();

// useEffect(()=>{
// const user=JSON.parse(localStorage.getItem("userInfo"));
// if(user){
//   // navigate("/chats")
// }
//  //eslint-disable-next-line

// },)

  return (
    <>
    <Container maxW="xl" centerContent 
   
    >
 <Box 
 d="flex"
 justifyContent="center"
 p={3}
 bg={"white"}
 w="100%"
 m="40px 0 15px 0"
 borderRadius="lg"
 borderWidth="1px"
 border="1px solid black"
 >
      <Text fontSize="4xl" fontFamily="sans-serif" textAlign="center">Talk-a-Tive</Text>
 </Box>
 <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black" >
 <Tabs variant='soft-rounded' >
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
     <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
 </Box>
    </Container>
    </>
   
  )
}

export default Homepage
