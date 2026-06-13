export const findPrimes = (max: number): number[] => {
  if (max < 2) return [];

  const sieve = new Array(max + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;

  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= max; i++) {
    if (sieve[i]) {
      primes.push(i);
    }
  }

  return primes;
};
