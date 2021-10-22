# Fibonacci Express
"Quem Sabe Faz Ao Vivo" Edition

### Yarn Dependencies

```
yarn add express node-worker-threads-pool
yarn add -D typescript ts-node @types/node @types/express
touch tsconfig.json
```

### `tsconfig.json` file

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  }
}
```

### Yarn Scripts Snippet
```json
{
  "scripts": {
    "start:dev": "ts-node src/index.ts",
    "build": "rm -rf dist && tsc",
    "prestart": "yarn build",
    "start": "node dist/index.js"
  }
}
```

### Empty Files
```
mkdir src src/fib src/fib/simple src/fib/workers
touch src/index.ts src/fib/simple/index.ts src/fib/workers/index.ts 
```

### Fibonacci Implementation (simple)
```ts
export async function fibonacciOf(value: number) {
  let a = 1n, b = 0n, c = 0n;

  for (let i = 0; i < value; i++) {
    c = b;
    b = a;
    a = c + b;
  }

  return a.toString(10);
}
```

### Fibonacci Stub (workers)
```ts
export async function fibonacciOf(value: number) {
  throw new Error("TODO: This is a stub.");
}
```

### Express.js bootstrap code
```ts
import express from 'express';
import { fibonacciOf } from './fib/simple';

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
```

### Worker Pool code
```ts
import { StaticPool } from 'node-worker-threads-pool';

const pool = new StaticPool({
  size: 4,
  task: `${__dirname}/workerMain.js`,
  workerData: 'workerData!'
});
```

### More files
```
touch src/fib/workers/workerMain.ts src/fib/workers/workerMain.js
```

### Worker Main stub
```ts
import { parentPort } from 'worker_threads';

const port = parentPort;
if (!port) {
  throw Error("This code is meant to run on a worker thread!");
}

port.on('message', async (param) => {
  throw new Error("TODO: This is a stub.");
});
```

### Worker Main's `ts-node` bootstrap code
```js
/**
 * Esse arquivo faz bootstrap do ts-node para uma Worker Thread.
 */
const path = require('path');
require('ts-node').register();
require(path.resolve(__dirname, './workerMain.ts'));
```

### Fibonacci Submit task to Worker
```ts
type WorkerResult = { success: number } | { error: string };

export async function fibonacciOf(value: number) {
  const res: WorkerResult = await pool.exec(value);

  if ('success' in res) {
    return res.success;
  } else {
    throw new Error(res.error);
  }
}
```

### Fibonacci Worker Main code
```ts
port.on('message', async (param) => {
  if (typeof param !== 'number') {
    port.postMessage({ error: 'param must be a number.' });
    return;
  }
  const fib = await fibonacciOf(param);
  port.postMessage({ success: fib });
});
```
