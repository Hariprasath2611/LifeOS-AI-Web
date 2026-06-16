import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { AiService } from '../services/ai.service.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for user
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = notes.map(n => ({
      ...n,
      tags: n.tags ? n.tags.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const { title, content, category, tags } = req.body;

  try {
    const note = await prisma.note.create({
      data: {
        title: title || 'Untitled Note',
        content: content || '',
        category: category || 'Personal',
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
        userId
      }
    });

    res.json({
      ...note,
      tags: note.tags ? note.tags.split(',') : []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;
  const { title, content, category, tags, favorite } = req.body;

  try {
    const note = await prisma.note.findFirst({
      where: { id, userId }
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : note.title,
        content: content !== undefined ? content : note.content,
        category: category !== undefined ? category : note.category,
        tags: Array.isArray(tags) ? tags.join(',') : (tags !== undefined ? tags : note.tags),
        favorite: favorite !== undefined ? !!favorite : note.favorite
      }
    });

    res.json({
      ...updatedNote,
      tags: updatedNote.tags ? updatedNote.tags.split(',') : []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

/**
 * @route   POST /api/notes/:id/summarize
 * @desc    Generate AI Note summary
 */
router.post('/:id/summarize', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const note = await prisma.note.findFirst({
      where: { id, userId }
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    const summary = await AiService.generateNoteSummary(note.title, note.content);

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { aiSummary: summary }
    });

    res.json({
      ...updatedNote,
      tags: updatedNote.tags ? updatedNote.tags.split(',') : []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete note
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as string;
  const id = req.params.id as string;

  try {
    const note = await prisma.note.findFirst({
      where: { id, userId }
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    await prisma.note.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

export default router;
