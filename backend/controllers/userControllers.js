const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async(req,res)=>{
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the required fields") 
    }

    const userExists = await User.findOne({email});

    if( userExists){
        res.status(400);
        throw new Error("User already exists"); 
    }

    const user = await User.create({
        name, email, password, pic
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Faild to create the user"); 
    }
});


const authUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password)) ){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Invalid Email or Password"); 
    }
})


// update user
const updateUser = asyncHandler (async(req,res)=>{
    const userId = req.params._id;
    console.log("userId: ", userId)

    const updatedUser = await User.findByIdAndUpdate(
    userId, req.body,
      {
        new:true
      }
    );
    if(!updatedUser){
      res.status(404);
      throw new Error("User not found");
    }else{
      res.json(updatedUser)
    }
  });
  

//api/users?search=shahid
const allUsers = asyncHandler( async (req, res)=>{
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    console.log("search = ",req.query.search)
    console.log("users = ",users)
   res.send(users);
   
});
module.exports = {registerUser,authUser,allUsers,updateUser};