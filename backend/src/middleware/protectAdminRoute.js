// middleware/adminAuthMiddleware.js
import { supabase } from '../lib/supabase.js';
import Admin from '../models/admin.model.js';

export const protectAdminRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided.' });
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
      return res.status(401).json({
        message: 'Not authorized, invalid token.',
      });
    }

    // Find the admin user by ID from the decoded token.
    // Use Sequelize's findByPk and the 'attributes' option to exclude sensitive data.
    const admin = await Admin.findByPk(supabaseUser.id);

    if (!admin) {
      // If the user is authenticated but not found in the Admin table, they are not an admin.
      return res.status(403).json({ message: 'Not authorized. Admin access required.' });
    }

    // Attach the admin object to the request for subsequent middleware/controllers
    req.admin = admin;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in protectAdminRoute middleware: ', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}.` 
      });
    }

    next();
  };
};
