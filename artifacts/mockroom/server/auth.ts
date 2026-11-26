import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'the_mock_room_secret_key_2026_jwt_token';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const database = db.getDb();
    const foundUser = database.users.find(u => u.id === payload.id && u.isActive);

    if (!foundUser) {
      res.status(401).json({ error: 'User account not found or deactivated' });
      return;
    }

    req.user = foundUser;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(allowedRoles: ('superadmin' | 'mentor' | 'student')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}` });
      return;
    }
    next();
  };
}

export const requireAdmin = [requireAuth, requireRole(['superadmin'])];
export const requireMentor = [requireAuth, requireRole(['superadmin', 'mentor'])];
export const requireStudent = [requireAuth, requireRole(['student'])];
