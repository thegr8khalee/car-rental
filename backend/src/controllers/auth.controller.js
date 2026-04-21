// controllers/auth.controller.js
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import { supabase } from '../lib/supabase.js';
import { Op } from 'sequelize';

export const signup = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ message: 'Signup failed' });
    }

    // 2. Create user in local PostgreSQL database
    // We use the ID from Supabase Auth as our primary key
    const newUser = await User.create({
      id: authData.user.id,
      username: fullName,
      email,
      phoneNumber,
    });

    if (authData.session) {
      res.cookie('jwt', authData.session.access_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } else {
      res.status(200).json({
        message:
          'Signup successful. Please check your email to verify your account.',
        emailConfirmationRequired: true,
      });
    }
  } catch (error) {
    console.error('Error in signup controller: ', error.message);
    // If local DB creation fails, we might want to delete the Supabase user to keep consistency
    // await supabase.auth.admin.deleteUser(authData.user.id);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // 2. Fetch user details from local DB
    const user = await User.findByPk(data.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User record not found' });
    }

    // Set the access token in a cookie (or return it in the body)
    res.cookie('jwt', data.session.access_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error in login Controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
    }

    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged Out successfully' });
  } catch (error) {
    console.error('Error in logout controller: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authenticated: No token provided.' });
    }

    // Verify token with Supabase
    let supabaseUser;
    let error;

     // Simple retry mechanism for network glitches
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await supabase.auth.getUser(token);
        supabaseUser = result.data.user;
        error = result.error;
        if (!error && supabaseUser) break; // Success
        if (error && error.status !== 500 && error.status !== 502 && error.status !== 504) {
           // If it's a client error (e.g. invalid token), don't retry
           break;
        }
      } catch (err) {
        // Network errors or other exceptions
        console.warn(`Supabase auth check failed (attempt ${attempt + 1}/2):`, err.message);
        if (attempt === 0) await new Promise(r => setTimeout(r, 500)); // Short delay
      }
    }

    if (error || !supabaseUser) {
       res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
      return res.status(401).json({ message: 'Not authenticated: Invalid token.' });
    }

    // Check if it's an admin
    const admin = await Admin.findByPk(supabaseUser.id, {
        attributes: { exclude: ['passwordHash'] },
    });

    if (admin) {
        return res.status(200).json({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: 'admin',
            avatarUrl: admin.avatar,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        });
    }

    // Check if it's a regular user
    const user = await User.findByPk(supabaseUser.id, {
        attributes: { exclude: ['passwordHash'] },
    });

    if (user) {
        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: 'user',
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    // User authenticated in Supabase but not found in our DBs
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
    return res.status(401).json({
        message: 'Not authenticated: Account not found.',
    });

  } catch (error) {
    console.error('Error in checkAuth controller:', error);
    if (res.headersSent) {
      return;
    }
    return res
      .status(500)
      .json({ message: 'Internal Server Error during authentication check.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: 'Not authenticated: User information missing.' });
    }

    const { username, email, phoneNumber } = req.body;
    const userId = req.user.id;

    // Use Sequelize's findByPk (find by primary key)
    const authenticatedEntity = await User.findByPk(userId);

    if (!authenticatedEntity) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (email !== undefined) {
      // Check for email uniqueness, excluding the current user's email
      if (email !== authenticatedEntity.email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists && emailExists.id !== userId) {
          return res
            .status(400)
            .json({ message: 'Email already in use by another user.' });
        }
      }
      authenticatedEntity.email = email;
    }

    // Update other fields if they are provided
    if (username !== undefined) {
      authenticatedEntity.username = username;
    }
    if (phoneNumber !== undefined) {
      authenticatedEntity.phoneNumber = phoneNumber;
    }

    // Save the updated entity. Sequelize's .save() will update the existing instance.
    await authenticatedEntity.save();

    const responseData = {
      id: authenticatedEntity.id,
      username: authenticatedEntity.username,
      email: authenticatedEntity.email,
      phoneNumber: authenticatedEntity.phoneNumber,
      createdAt: authenticatedEntity.createdAt,
      updatedAt: authenticatedEntity.updatedAt,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in updateProfile controller:', error);
    if (res.headersSent) {
      console.warn(
        'Headers already sent, cannot send error response from updateProfile catch block.'
      );
      return;
    }
    res
      .status(500)
      .json({ message: 'Internal Server Error during profile update.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: 'Not authenticated: User information missing.' });
    }

    const userId = req.user.id;
    
    // Find the user first to ensure they exist and to get a meaningful response
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Account not found or already deleted.' });
    }

    // Delete the Supabase auth user so credentials cannot be reused.
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (supaErr) {
      console.error('Supabase deleteUser error:', supaErr?.message || supaErr);
    }

    // Use Sequelize's destroy method to delete the record
    await user.destroy();

    res.clearCookie('jwt', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({ message: `Your account has been deleted successfully.` });
  } catch (error) {
    console.error('Error in deleteAccount controller:', error.message);
    if (res.headersSent) {
      console.warn(
        'Headers already sent, cannot send error response from deleteAccount catch block.'
      );
      return;
    }
    res
      .status(500)
      .json({ message: 'Internal Server Error during account deletion.' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Please provide an email address.' });
  }

  try {
    // Use Sequelize's findOne with a where clause
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    }

    const redirectTo = `${process.env.CLIENT_URL}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );
    if (resetError) {
      console.error('Supabase reset email error:', resetError.message);
    }

    res.status(200).json({
      message:
        'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Error in forgotPassword controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req, res) => {
  // With Supabase, password reset is completed on the client after the user
  // clicks the email link. This endpoint accepts the recovery access token
  // (obtained on the client from the redirect URL hash) and the new password.
  const { accessToken, newPassword } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'Missing recovery access token.' });
  }
  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: 'New password must be at least 8 characters long.' });
  }

  try {
    const { error } = await supabase.auth.admin.updateUserById
      ? await supabase.auth.admin.updateUserById(
          (await supabase.auth.getUser(accessToken)).data?.user?.id,
          { password: newPassword }
        )
      : await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: 'New password must be at least 8 characters long.' });
  }

  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: 'Not authenticated: User information missing.' });
  }

  try {
    const { error } = await supabase.auth.admin.updateUserById(req.user.id, {
      password: newPassword,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error in changePassword controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
