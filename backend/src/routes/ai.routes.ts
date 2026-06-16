import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AiService } from '../services/ai.service.js';

const router = Router();
router.use(authMiddleware);

/**
 * @route   POST /api/ai/coach
 * @desc    Get AI Coach response for conversational logs
 */
router.post('/coach', async (req: Request, res: Response): Promise<void> => {
  const { message, context } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message content is required.' });
    return;
  }

  try {
    const responseText = await AiService.generateCoachingResponse(message, context || '');
    res.json({ response: responseText });
  } catch (err) {
    res.status(500).json({ error: 'AI coaching processing failed.' });
  }
});

export default router;
