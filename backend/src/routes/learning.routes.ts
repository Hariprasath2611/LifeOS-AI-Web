import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   GET /api/learning/skills
 * @desc    Get all skills for user
 */
router.get('/skills', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const skills = await prisma.skill.findMany({
      where: { userId }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

/**
 * @route   POST /api/learning/skills
 * @desc    Create a new skill tracking
 */
router.post('/skills', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { name, category, level } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Skill name is required.' });
    return;
  }

  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        category: category || 'General',
        level: level || 'Beginner',
        progress: 10,
        userId
      }
    });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill.' });
  }
});

/**
 * @route   PUT /api/learning/skills/:id
 * @desc    Update skill progress percentage
 */
router.put('/skills/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;
  const { progress } = req.body;

  try {
    const skill = await prisma.skill.findFirst({
      where: { id, userId }
    });

    if (!skill) {
      res.status(404).json({ error: 'Skill not found.' });
      return;
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: { progress: parseInt(progress) || 0 }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill.' });
  }
});

/**
 * @route   POST /api/learning/sessions
 * @desc    Log a Pomodoro study session
 */
router.post('/sessions', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { duration } = req.body; // in minutes

  if (!duration) {
    res.status(400).json({ error: 'Session duration is required.' });
    return;
  }

  try {
    const session = await prisma.studySession.create({
      data: {
        duration: parseInt(duration),
        userId
      }
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log session.' });
  }
});

/**
 * @route   GET /api/learning/sessions/total
 * @desc    Get aggregated focus session minutes
 */
router.get('/sessions/total', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const aggregates = await prisma.studySession.aggregate({
      where: { userId },
      _sum: { duration: true }
    });
    res.json({ totalMinutes: aggregates._sum.duration || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate study time.' });
  }
});

export default router;
