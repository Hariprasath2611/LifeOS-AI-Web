import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   GET /api/analytics/summary
 * @desc    Compile aggregated analytics indices
 */
router.get('/summary', async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // 1. Task counts
    const totalTasks = await prisma.task.count({ where: { userId } });
    const completedTasks = await prisma.task.count({ where: { userId, status: 'completed' } });

    // 2. Goal progress
    const goals = await prisma.goal.findMany({ where: { userId } });
    const averageGoalProgress = goals.length > 0 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
      : 0;

    // 3. Habit streaks
    const habits = await prisma.habit.findMany({ where: { userId } });
    const maxStreak = habits.reduce((acc, h) => h.streak > acc ? h.streak : acc, 0);

    // 4. Focus study minutes
    const aggregates = await prisma.studySession.aggregate({
      where: { userId },
      _sum: { duration: true }
    });
    const totalStudyMinutes = aggregates._sum.duration || 0;

    // 5. Calculate productivity index
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const productivityScore = Math.min(
      100,
      Math.round((taskCompletionRate * 0.4) + (averageGoalProgress * 0.3) + (maxStreak * 2.5) + (totalStudyMinutes / 6))
    );

    res.json({
      productivityScore,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: Math.round(taskCompletionRate)
      },
      goals: {
        total: goals.length,
        averageProgress: averageGoalProgress
      },
      habits: {
        total: habits.length,
        maxStreak
      },
      learning: {
        totalMinutes: totalStudyMinutes
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compile analytics.' });
  }
});

export default router;
