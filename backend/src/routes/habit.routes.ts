import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   GET /api/habits
 * @desc    Get all habits for user
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const habits = await prisma.habit.findMany({
      where: { userId }
    });

    const formatted = habits.map(h => ({
      ...h,
      history: h.history ? h.history.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch habits.' });
  }
});

/**
 * @route   POST /api/habits
 * @desc    Create a new habit
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { name, description, frequency, category } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Habit name is required.' });
    return;
  }

  try {
    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        frequency: frequency || 'daily',
        category: category || 'Productive',
        streak: 0,
        history: '',
        userId
      }
    });

    res.json({
      ...habit,
      history: []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create habit.' });
  }
});

/**
 * @route   POST /api/habits/:id/toggle
 * @desc    Check/uncheck completion on a date and update streak
 */
router.post('/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;
  const { dateStr } = req.body;

  if (!dateStr) {
    res.status(400).json({ error: 'Date is required.' });
    return;
  }

  try {
    const habit = await prisma.habit.findFirst({
      where: { id, userId }
    });

    if (!habit) {
      res.status(404).json({ error: 'Habit not found.' });
      return;
    }

    let historyArr = habit.history ? habit.history.split(',') : [];
    const exists = historyArr.includes(dateStr);
    
    if (exists) {
      historyArr = historyArr.filter(d => d !== dateStr);
    } else {
      historyArr.push(dateStr);
    }

    let currentStreak = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (historyArr.includes(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (historyArr.includes(yesterdayStr)) {
            continue;
          }
        }
        break;
      }
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        history: historyArr.join(','),
        streak: currentStreak
      }
    });

    res.json({
      ...updatedHabit,
      history: historyArr
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle habit date.' });
  }
});

/**
 * @route   DELETE /api/habits/:id
 * @desc    Delete a habit
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const habit = await prisma.habit.findFirst({
      where: { id, userId }
    });

    if (!habit) {
      res.status(404).json({ error: 'Habit not found.' });
      return;
    }

    await prisma.habit.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Habit deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete habit.' });
  }
});

export default router;
