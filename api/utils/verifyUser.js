import  {errorHandler}  from './error.js';
import jwt from 'jsonwebtoken'

export const veryfyToken = (req, res, next) =>{
   
    const token = req.cookies.access_token;
    
    if (!token) return next(errorHandler(401,'unauthorized'));
    jwt.verify(token, process.env.JWT_SECRET, (error, user)=>{
       // if (error) return next(errorHandler(401,'Forbidden'));
       if (error) {
        console.error('JWT Verification Error:', error);
        return next(errorHandler(401, 'Forbidden'));
    }
        req.user = user;
        next();
    });
}