import { StaticPool } from 'node-worker-threads-pool';

const pool = new StaticPool({
  size: 4,
  task: `${__dirname}/workerMain.js`,
  workerData: 'workerData!'
});

type WorkerResult = { success: number } | { error: string };

export async function fibonacciOf(value: number) {
  const res: WorkerResult = await pool.exec({ value });

  if ('success' in res) {
    return res.success;
  } else {
    throw new Error(res.error);
  }
}
