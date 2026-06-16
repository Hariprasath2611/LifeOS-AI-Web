import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lifeos_fallback_secret_key_123';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Support Mock auth for local development and testing
  if (req.headers['x-mock-user-id']) {
    (req as any).userId = req.headers['x-mock-user-id'] as string;
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    // If JWT fails but we want local ease of use, mock verify
    if (token.startsWith('mock_token_')) {
      (req as any).userId = token.replace('mock_token_', '');
      return next();
    }
    res.status(401).json({ error: 'Invalid authentication token.' });
  }
};
