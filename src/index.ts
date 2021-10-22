import express from 'express';
import { fibonacciOf } from './fib/workers';

const app = express();
const port = 3000;

app.get('/fib/:value', async (req, res, next) => {
  try {
    const n = Number(req.params.value);
    const fib = await fibonacciOf(n);
    res.json({ n, fib });
  } catch (e) {
    next(e);
  }
});

app.listen(port, () => {
  console.log(`API: http://localhost:${port}`)
});
