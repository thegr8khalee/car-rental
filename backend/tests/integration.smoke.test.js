import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

// Light-weight mocks to avoid external calls while exercising route wiring
jest.unstable_mockModule('../src/lib/db.js', () => ({
  default: {
    define: jest.fn(() => ({ belongsTo: jest.fn(), hasMany: jest.fn() })),
    sync: jest.fn(),
    authenticate: jest.fn(),
  },
}));

jest.unstable_mockModule('../src/middleware/protectAdminRoute.js', () => ({
  protectAdminRoute: jest.fn((req, _res, next) => {
    req.admin = { id: 'admin-1', role: 'admin' };
    next();
  }),
  requireRole: jest.fn(() => (req, _res, next) => {
    req.admin = req.admin || { id: 'admin-1', role: 'admin' };
    next();
  }),
}));

jest.unstable_mockModule('../src/middleware/protectRoute.js', () => ({
  protectRoute: jest.fn((req, _res, next) => {
    req.user = { id: 'user-1' };
    next();
  }),
}));

const makeHandler = (name, status = 200) => jest.fn((req, res) => res.status(status).json({ route: name }))

jest.unstable_mockModule('../src/controllers/admin.controller.js', () => ({
  adminSignup: makeHandler('adminSignup'),
  adminLogin: makeHandler('adminLogin'),
  adminLogout: makeHandler('adminLogout'),
}));

jest.unstable_mockModule('../src/controllers/auth.controller.js', () => ({
  signup: makeHandler('signup'),
  login: makeHandler('login'),
  logout: makeHandler('logout'),
  changePassword: makeHandler('changePassword'),
  deleteAccount: makeHandler('deleteAccount'),
  forgotPassword: makeHandler('forgotPassword'),
  resetPassword: makeHandler('resetPassword'),
  updateProfile: makeHandler('updateProfile'),
  checkAuth: makeHandler('checkAuth'),
}));

jest.unstable_mockModule('../src/controllers/car.controller.js', () => ({
  getCars: makeHandler('getCars'),
  getCarById: makeHandler('getCarById'),
  getAllCars: makeHandler('getAllCars'),
  Search: makeHandler('Search'),
}));

jest.unstable_mockModule('../src/controllers/blog.controller.js', () => ({
  getBlogs: makeHandler('getBlogs'),
  getBlogById: makeHandler('getBlogById'),
  getAllBlogs: makeHandler('getAllBlogs'),
  getRelatedBlogsById: makeHandler('getRelatedBlogsById'),
  searchBlogs: makeHandler('searchBlogs'),
}));

jest.unstable_mockModule('../src/controllers/admin.operations.controller.js', () => ({
  addCar: makeHandler('addCar'),
  updateCar: makeHandler('updateCar'),
  deleteCar: makeHandler('deleteCar'),
  addBlog: makeHandler('addBlog'),
  updateBlog: makeHandler('updateBlog'),
  deleteBlog: makeHandler('deleteBlog'),
  getNewsletterStats: makeHandler('getNewsletterStats'),
  getRecentBroadcasts: makeHandler('getRecentBroadcasts'),
  sendNewsletter: makeHandler('sendNewsletter'),
}));

// Import routes after mocks are set
const adminAuthRoutes = (await import('../src/routes/admin.auth.routes.js')).default;
const userAuthRoutes = (await import('../src/routes/user.auth.routes.js')).default;
const adminOpsRoutes = (await import('../src/routes/admin.operations.routes.js')).default;
const carRoutes = (await import('../src/routes/car.routes.js')).default;
const blogRoutes = (await import('../src/routes/blog.routes.js')).default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/admin/ops', adminOpsRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/blogs', blogRoutes);

const endpoints = [
  { method: 'post', url: '/api/admin/auth/signup', expectRoute: 'adminSignup' },
  { method: 'post', url: '/api/admin/auth/login', expectRoute: 'adminLogin' },
  { method: 'post', url: '/api/user/auth/signup', expectRoute: 'signup' },
  { method: 'post', url: '/api/user/auth/login', expectRoute: 'login' },
  { method: 'get', url: '/api/cars/get-all', expectRoute: 'getAllCars' },
  { method: 'get', url: '/api/blogs/get-all', expectRoute: 'getAllBlogs' },
  { method: 'post', url: '/api/admin/ops/add-car', expectRoute: 'addCar' },
  { method: 'delete', url: '/api/admin/ops/delete-car/123', expectRoute: 'deleteCar' },
  { method: 'post', url: '/api/admin/ops/add-blog', expectRoute: 'addBlog' },
  { method: 'delete', url: '/api/admin/ops/delete-blog/abc', expectRoute: 'deleteBlog' },
];

describe('Integration smoke tests (routing + middleware)', () => {
  it.each(endpoints)(`%s %s returns 200 and expected route`, async ({ method, url, expectRoute }) => {
    const res = await request(app)[method](url).send({ test: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.route).toBe(expectRoute);
  });
});
