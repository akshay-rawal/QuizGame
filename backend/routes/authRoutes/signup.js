    import express from 'express';
    import User from '../../models/userSchema.js';
    import jwt from "jsonwebtoken"

    const router = express.Router();

    //signup Route

    router.post('/signup',async (req, res) => {
        console.log('Signup route was hit');
        console.log(req.body);
        try {

            const { username, email, password } = req.body;

            //regexp for email
                    const emilRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emilRegex.test(email)) {
                        return res.status(400).json({message:"invalid email format."})
                    }

                    //check if email user already availble in database  
                    const existingUser = await User.findOne({ email });
                    if (existingUser) {
                    return res.status(400).json({ message: 'Email is already registered.' });
                    }

                    //regexp for password

                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (!passwordRegex.test(password)) {
                        return res.status(400).json({
                            message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
                        });

                    }
                    //create and save new user 
                    const user = new User({
                        username,
                        email,
                        password, // Password is passed directly, pre('save') middleware will hash it
                
                    })
                    await user.save()
                    //generate jwt token
                    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
                    console.log("Generated Token:", token);


                    //send the token and and success message
                    res.status(201).json({
                        message:'user registerd successfully',token,
                    })
                    
            
        } catch (error) {
            res.status(500).json({message:"error registered user",error:error.message})
            
        }
    })

    export default router;

    

    

