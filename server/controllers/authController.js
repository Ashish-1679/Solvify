const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');



const signUp = async(req,res) =>{
const {username,email,password} = req.body;
try{
    if(!username||!email||!password){
        return res.json({success:false,message:'Missing Details'});
    }
      const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'User already exists' });
    }
    const salt = await  bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username,email, password: hashedPassword });
    const userId = newUser._id;
     const token = jwt.sign({userId}, process.env.JWT_SECRET);
     return res.json({success : true, message : 'User Created successfully',token,userData:{
        userId,
        username,
        email
     }});

}
catch(error){
   return res.json({message: "Error occured signing Up " })
}
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

       const userId = user._id
     const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return res.json({ success: true, message: 'Login successful', token, userData:{
        userId,
        username : user.username,
        email: user.email
    }
  })} catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: 'Error occurred while logging in' });
  }
};
module.exports = {login,signUp};