import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User Already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', maxAge: 7 * 24 * 24 * 60 * 60 * 1000 })

        return res.json({ success: true, message: 'User registerd successfully', user: { email: user.email, name: user.name, password: hashedPassword } })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })


    }

}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path:'/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // Default to 7 days
        });

        // Respond with user details (excluding password)
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({ success: true, message: 'Login successful.', user: userWithoutPassword });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
};

export const isAuth = async (req, res) => {
    try {
        if (!req.body || !req.body.id) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }
        const { userId } = req.body;
        const user = await User.findById(userId).select('-password');
        return res.status(200).json({ success: true, message: 'User authenticated', user: user });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong.' })
    }

}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path:'/',
       maxAge:0
    });
    return res.status(200).json({ success: true, message: 'Logged out.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};
 

export const Me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
