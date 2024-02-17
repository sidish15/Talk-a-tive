const jwt = require("jsonwebtoken");
const User = require("../models/userModule.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
        let token;
      
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          try {
            token = req.headers.authorization.split(" ")[1];
      
            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
           console.log("decoded",decoded)
           //we are defining a user variable inside request 
           //user k andar poora detail aajayega login user wala aur jo ki request k andar h
            req.user = await User.findById(decoded.id).select("-password");
      
            next();
          } catch (error) {
            res.status(401).send({message:"Not authorized, token failed"});
            
          }
        }
      
        if (!token) {
          res.status(401).send({message:"No authorize ,not token"});
        }
      });
      
module.exports = { protect }