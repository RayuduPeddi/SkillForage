import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is ready' });
});

app.post('/api/ai-chat', (req, res) => {
  const { message, context } = req.body;
  res.json({
    reply: `AI Mentor received: ${message}. Current topic: ${context?.currentTopic || 'None'}`,
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
