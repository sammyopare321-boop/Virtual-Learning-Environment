const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  let { name, email, password, department, role } = req.body;

  // Security: Prevent registration as admin
  if (role === 'admin') {
    role = 'student';
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    department,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password',
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log(`[AUTH] Login failed: User not found for email: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Prevent Google users from logging in manually (they don't know their random password)
  if (user.authProvider === 'google') {
    console.log(`[AUTH] Login failed: Google user attempting password login: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'This account was created using Google Sign-In. Please click the Google button to log in.',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    console.log(`[AUTH] Login failed: Invalid password for email: ${email}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  console.log(`[AUTH] Login successful: ${email} (${user.role})`);
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Logout user — clears the HttpOnly token cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 0, // Immediately expire
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Get token from model, set HttpOnly cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieOptions = {
    httpOnly: true,                                      // Not accessible via document.cookie — XSS safe
    secure: true,                                        // MUST be true for SameSite: 'none'
    sameSite: 'none',                                    // Required for cross-domain (Vercel -> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,                    // 7 days in ms
  };

  const userData = user.toObject();
  delete userData.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token, // Also returned in body for clients that prefer header-based auth
      data: userData,
    });
};

// @desc    Login or Register user with Google
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { token, role, department } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a Google ID token',
    });
  }

  try {
    // 1. Verify token with Google's tokeninfo API
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, email_verified, picture, aud } = googleRes.data;

    // Security: Verify audience to ensure the token was issued for our app
    if (aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        success: false,
        message: 'Token audience mismatch',
      });
    }

    if (!email_verified || email_verified === 'false') {
      return res.status(400).json({
        success: false,
        message: 'Google email is not verified',
      });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // 3. User does not exist, so register them!
      let resolvedRole = role || 'student';
      // Security: Prevent registration as admin via Google Sign-In
      if (resolvedRole === 'admin') {
        resolvedRole = 'student';
      }

      // Generate a random secure password so mongoose validation succeeds
      const randomPassword = crypto.randomBytes(16).toString('hex');

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        role: resolvedRole,
        department: department || 'General',
        avatar: picture || 'no-photo.jpg',
        authProvider: 'google',
      });
    }

    // 4. Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('[Google OAuth Error]', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid Google token or OAuth error',
    });
  }
});
