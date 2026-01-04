import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello world' });
});

const conversations = new Map<string, string>();

router.post('/api/chat', chatController.sendMessage);

export default router;
