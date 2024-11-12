import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productsRouter from './routes/products.js';
import salesRouter from './routes/sales.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Botilleria API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});