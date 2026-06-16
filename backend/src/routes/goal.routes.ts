import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { AiService } from '../services/ai.service.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   GET /api/goals
 * @desc    Get all goals for user including milestones
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: { milestones: true }
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals.' });
  }
});

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { title, description, category, timeline, dueDate, milestones } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Goal title is required.' });
    return;
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        category: category || 'Career',
        timeline: timeline || 'short_term',
        dueDate,
        userId,
        milestones: {
          create: (milestones || []).map((title: string) => ({ title }))
        }
      },
      include: { milestones: true }
    });

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal.' });
  }
});

/**
 * @route   POST /api/goals/:id/milestones
 * @desc    Add a milestone to a goal
 */
router.post('/:id/milestones', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Milestone title is required.' });
    return;
  }

  try {
    const goal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        goalId: id
      }
    });

    const allMilestones = await prisma.milestone.findMany({ where: { goalId: id } });
    const completed = allMilestones.filter(m => m.completed).length;
    const progress = Math.round((completed / allMilestones.length) * 100);

    await prisma.goal.update({
      where: { id },
      data: { progress }
    });

    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add milestone.' });
  }
});

/**
 * @route   PUT /api/goals/:goalId/milestones/:milestoneId/toggle
 * @desc    Toggle milestone completion status
 */
router.put('/:goalId/milestones/:milestoneId/toggle', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const goalId = req.params.goalId as string;
  const milestoneId = req.params.milestoneId as string;

  try {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId }
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId }
    });

    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found.' });
      return;
    }

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { completed: !milestone.completed }
    });

    const allMilestones = await prisma.milestone.findMany({ where: { goalId } });
    const completed = allMilestones.filter(m => m.completed).length;
    const progress = Math.round((completed / allMilestones.length) * 100);

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: { progress },
      include: { milestones: true }
    });

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle milestone.' });
  }
});

/**
 * @route   POST /api/goals/:id/ai-action-plan
 * @desc    Generate action plan steps using AI Service
 */
router.post('/:id/ai-action-plan', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const goal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    const aiSteps = await AiService.generateMilestones(goal.title, goal.description || '');

    await prisma.milestone.createMany({
      data: aiSteps.map(title => ({
        title,
        goalId: id,
        completed: false
      }))
    });

    const allMilestones = await prisma.milestone.findMany({ where: { goalId: id } });
    const completed = allMilestones.filter(m => m.completed).length;
    const progress = Math.round((completed / allMilestones.length) * 100);

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { 
        progress,
        aiActionPlanGenerated: true
      },
      include: { milestones: true }
    });

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI action plan.' });
  }
});

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete goal
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const goal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    await prisma.goal.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Goal deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal.' });
  }
});

export default router;
