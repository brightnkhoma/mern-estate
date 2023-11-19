import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'


export const signup = async (req, res, next)=>{
    const { username, email, password } = req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser= new User({username, email, password : hashedPassword});
    try{
        await newUser.save();
        res.status(201).json('user created successfully');
    }   
   
    catch(e){
        next(e);
    }
    
} 

export const signin= async (req, res, next) => {
    const {email, password}=req.body
    try{
        const validUser=await User.findOne({email});
        if (!validUser) return next(errorHandler(404,'user not found'));
        const validPassword=bcryptjs.compareSync(password,validUser.password)
        if (!validPassword) return next(errorHandler(401,'wrong credentials'));
        const token= jwt.sign({id : validUser._id},process.env.JWT_SECRET)
        res
           .cookie('access_token', token,{httpOnly : true})
           .status(200)
           .json(validUser);

    }
    catch(e){
        next(e)
    }
}

export const google =async (req, res, next) => {
    try {
        
        const validUser =await User.findOne({ email: req.body.email})
        if (validUser) {
            const token= jwt.sign({id : validUser._id},process.env.JWT_SECRET);
            const { password : pass, ...rest} = validUser._doc;
        res
           .cookie('access_token', token,{httpOnly : true})
           .status(200)
           .json(rest);

        }
        else{
            const generatedPassword =  Math.random().toString(36).slice(-1)+ Math.random().toString(36).slice(-1);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
            const newUser = new User({email : req.body.email,username : req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),password : hashedPassword,avatar : req.body.photo});
            await newUser.save();
            const token = jwt.sign({id : newUser._id,}, process.env.JWT_SECRET);
            const { password : pass, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly : true}).status(200).json(rest);
        }
        
    } catch (error) {
        next(error)
    }
}


export const signOut = (req, res,next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('user sign out successfully');
        
    } catch (error) {
        next(error)
    }
    
};