"use client";

import { useState, useEffect } from "react";

const IsPrime = () => {
  const [number, setNumber] = useState("");
  const [factors, setFactors] = useState(null);
  const [firstHundredPrimes, setFirstHundredPrimes] = useState([]);
  const [specialPrimes, setSpecialPrimes] = useState({
    mersenne: false,
    germaine: false,
  });

  const isPrime = (num) => {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  };

  useEffect(() => {
    const primes = [];
    let num = 2;
    while (primes.length < 100) {
      if (isPrime(num)) {
        primes.push(num);
      }
      num++;
    }
    setFirstHundredPrimes(primes);
  }, []);

  const primeFactorize = (n) => {
    const factors = [];
    let num = n;

    // Handle 2 separately to optimize odd number checks
    while (num % 2 === 0) {
      factors.push(2);
      num = num / 2;
    }

    // Only check odd numbers up to sqrt(n)
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
      }
    }

    // If num is still > 1, it's a prime factor
    if (num > 1) {
      factors.push(num);
    }

    return factors;
  };

  const formatFactors = (factors) => {
    if (factors.length === 0) return "";

    const counts = {};
    factors.forEach((factor) => {
      counts[factor] = (counts[factor] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([factor, power]) => (power === 1 ? factor : `${factor}^${power}`))
      .join(" × ");
  };

  const checkSpecialPrimes = (num) => {
    // Check if Mersenne prime (2^n - 1)
    const isMersenne = isPrime(num) && ((num + 1) & num) === 0;

    // Check if Germaine prime (if p and 2p + 1 are both prime)
    const isGermaine = isPrime(num) && isPrime(2 * num + 1);

    return { mersenne: isMersenne, germaine: isGermaine };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(number);
    if (num > 1) {
      const primeFactors = primeFactorize(num);
      setFactors(primeFactors);
      setSpecialPrimes(checkSpecialPrimes(num));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Prime Factorization
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="number"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setFactors(null);
              setSpecialPrimes({ mersenne: false, germaine: false });
            }}
            placeholder="Enter a number greater than 1"
            className="flex-1 p-2 border rounded"
            min="2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Factorize
          </button>
        </div>
      </form>

      {factors && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="text-2xl text-center font-mono">
            {number} = {formatFactors(factors)}
          </div>
          {specialPrimes.mersenne && (
            <div className="text-lg text-center text-green-600">
              This is a Mersenne prime! (2^n - 1)
            </div>
          )}
          {specialPrimes.germaine && (
            <div className="text-lg text-center text-blue-600">
              This is a Germaine prime! (p = {number} and 2p + 1 ={" "}
              {2 * number + 1} are both prime)
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">
          About Prime Factorization
        </h2>
        <p>
          Prime factorization is the process of determining which prime numbers
          multiply together to make the original number. Every positive integer
          greater than 1 can be represented uniquely as a product of prime
          numbers.
        </p>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">First 100 Prime Numbers</h2>
        <div className="grid grid-cols-10 gap-2 text-sm">
          {firstHundredPrimes.map((prime, index) => (
            <div key={prime} className="text-center">
              {prime}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IsPrime;
