import { parentPort } from 'worker_threads';
import { fibonacciOf } from '../simple';

const port = parentPort;
if (!port) {
  throw Error("This code is meant to run on a worker thread!");
}

port.on('message', async (param) => {
  if (typeof param !== 'number') {
    port.postMessage({ error: 'param must be a number.' });
    return;
  }
  const fib = await fibonacciOf(param);
  port.postMessage({ success: fib });
});
