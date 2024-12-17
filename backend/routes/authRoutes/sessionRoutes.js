import User from "../../models/userSchema.js";
import express from 'express';
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();

router.get('/session',authenticate, async(req,res)=>{
     try {
           const userId = req.userId
           if(!userId){
           return res.status(401).json({message:'unauthorized,no valid session'})
           }
   
           //fetch the user details from db,exclude password
              const user = await User.findById(userId).select('-password')
              if (!user) {
               return res.status(404).json({ message: "User not found." });
             }
             res.status(200).json({  message: 'Session is valid', user,token: req.token});
     } catch (error) {
      console.error('Error validating session:', error.message);
        res.status(500).json({ message: "Failed to fetch session.", error: error.message });
      } 
})

export default router;