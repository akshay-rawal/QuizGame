import User from "../../models/userSchema.js";
import express from 'express';
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();


router.get('/refresh',authenticate,async (req,res)=>{
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token found" });
  }
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    res.status(403).json({ message: "Invalid refresh token" });
  }
})

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