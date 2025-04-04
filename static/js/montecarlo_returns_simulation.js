function montecarlo_returns_simulation({ years, expectedReturn, volatility = 0.1, trials = 10 }) {
    // Generate normally distributed random numbers using Box-Muller transform
    function getNormal() {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random(); // Avoid zero values
        while (u2 === 0) u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    const results = [];
    for (let i = 0; i < trials; i++) {
        let portfolioValue = 1; // Normalized initial investment
        const annualReturns = [];

        for (let year = 0; year < years; year++) {
            const randomReturn = expectedReturn + volatility * getNormal();
            portfolioValue *= (1 + randomReturn);
            annualReturns.push(randomReturn);
        }
        results.push(annualReturns);
    }
    return results;
}
