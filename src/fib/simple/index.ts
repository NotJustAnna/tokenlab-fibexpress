export async function fibonacciOf(value: number) {
  let a = 1n, b = 0n, c = 0n;

  for (let i = 0; i < value; i++) {
    c = b;
    b = a;
    a = c + b;
  }

  return a.toString(10);
}
