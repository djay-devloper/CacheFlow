const User = require('../models/User');

const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
}

//Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  //Validation check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl: typeof profileImageUrl === 'string' && profileImageUrl.trim()
                ? profileImageUrl.trim()
                : '/default-avatar.svg',
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: " Error registering user", error: err.message });
    }
     



};

//Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //Validation check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        //Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Error logging in", error: err.message });
    }


};

// Get User Info
exports.getUserInfo = async (req, res) => {
 try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
 } catch (err) {
    res.status(500).json({ message: "Error getting user info", error: err.message });
 }
};

exports.updateUserProfile = async (req, res) => {
  const body = req.body || {};
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  if (!fullName || fullName.length > 100) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (phone && (!/^[+()\d\s.-]{7,25}$/.test(phone) || phone.replace(/\D/g, '').length < 7)) {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }

  try {
    const duplicateEmail = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (duplicateEmail) {
      return res.status(409).json({ message: 'That email address is already in use.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { fullName, email, phone } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That email address is already in use.' });
    }
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Could not update your profile.' });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const baseUrl = (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const imageUrl = `${baseUrl}/uploads/${encodeURIComponent(req.file.filename)}`;

    user.profileImageUrl = imageUrl;
    await user.save();

    const safeUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      message: 'Profile image updated successfully',
      imageUrl,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile image', error: error.message });
  }
};
