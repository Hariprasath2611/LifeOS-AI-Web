import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lifeos_fallback_secret_key_123';

/**
 * @route   POST /api/auth/login
 * @desc    Login or register mock user and return JWT
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    // If user does not exist, create them (auto-register on login for mock/firebase sync convenience)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0]
        }
      });
    }

    // Sign JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    console.error("Auth Error:", err);
    res.status(500).json({ error: 'Server error during auth verification.' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user details
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
