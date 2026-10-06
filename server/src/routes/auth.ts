import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticatedRequest, authenticateJWT } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      contractorId: user.contractorId
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true, contractor: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        contractor: user.contractor
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/demo-login
// 1-Click login for Academic Evaluator / Demo
router.post('/demo-login', async (req, res: Response) => {
  try {
    const { role } = req.body;
    const targetRole = role ? role.toUpperCase() : 'GOVERNMENT';

    let user = await prisma.user.findFirst({
      where: { role: targetRole },
      include: { department: true, contractor: true }
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: { department: true, contractor: true }
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'No demo user found. Please run seed.' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        contractor: user.contractor
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { department: true, contractor: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      contractor: user.contractor
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
