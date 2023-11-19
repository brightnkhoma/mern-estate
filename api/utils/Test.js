// import { Express } from "express";
// import User from "../models/user.models";
// import { errorHandler } from "./error";

// const route = express.Route();

// const app = express();

// const signup =async (req, res, next)=>{
//     const {name, email, password} = req.body;
//     try{
//         const newUser =new User(name, email, password);
//         await newUser.save();
//         res.status(200).json('signin success!')
//     }
//     catch(err){
//         next(err);
//     }

// }

// const signin = async (req, res, next)=>{
//     const {email, password} = req.body;
//     try{
//         const validUser = await User.findOne(email);
//         if(!validUser) return next(errorHandler(500, "User not found"))
//         const validPassword = User.compareSync(password,validUser.password)
//         if (!validPassword) return next(errorHandler(500, "password is incorrect"))
//     }
//     catch(err){
//         next(err);
//     }
// }

// route.post('/signup', signup)
// route.post('/signin', signin)

// app.use('api/auth', route)