import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running', api: '/api/ai-chat' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is ready' });
});

app.post('/api/ai-chat', (req, res) => {
  const { message, context } = req.body;
  res.json({
    reply: `AI Mentor received: ${message}. Current topic: ${context?.currentTopic || 'None'}`,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
