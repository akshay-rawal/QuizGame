import express from 'express';
import User from '../../models/userSchema.js';
import jwt from "jsonwebtoken"
  
const router = express.Router();

router.post('/login',async (req,res)=>{

try {
    const {email,password} = req.body;
    //check if the user exit in database
      const user = await User.findOne({email});
    if (!user) {
        return res.status(401).json({message:"invalid credential"})
        
    }


      //compare entered password with the hashed password in the database
      const userPassword = await user.comparePassword(password);
    
      if (!userPassword) {
           return res.status(401).json({message:"password is incorrect"})
      }
   
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({message:"login successfully",
        token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      }
      })

} catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });

}
})

export default router;