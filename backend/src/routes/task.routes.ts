import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged in user
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { title, description, priority, status, category, dueDate, isRecurring, recurInterval } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Task title is required.' });
    return;
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        status: status || 'todo',
        category: category || 'Work',
        dueDate,
        isRecurring: !!isRecurring,
        recurInterval,
        userId
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;
  const updateData = req.body;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found or access denied.' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        status: updateData.status,
        category: updateData.category,
        dueDate: updateData.dueDate,
        isRecurring: updateData.isRecurring,
        recurInterval: updateData.recurInterval
      }
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

export default router;
