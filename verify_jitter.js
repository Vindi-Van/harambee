
function getRetryDecision(attempt, retryable, policy) {
  if (!retryable || attempt >= policy.maxAttempts) {
    return { shouldRetry: false, delayMs: 0 };
  }

  const exp = Math.max(0, attempt - 1);
  const rawDelay = policy.baseDelayMs * Math.pow(2, exp);
  const capped = Math.min(rawDelay, policy.maxDelayMs);
  const jitter = capped * policy.jitterRatio;
  const randomized = capped - jitter + Math.random() * (jitter * 2);

  return { shouldRetry: true, delayMs: Math.max(0, Math.floor(randomized)) };
}

const defaultRetryPolicy = {
  maxAttempts: 10, // Increase attempts to reach maxDelayMs
  baseDelayMs: 250,
  maxDelayMs: 5000,
  jitterRatio: 0.2
};

console.log("Testing jitter logic...");
let exceeded = false;
for (let i = 0; i < 1000; i++) {
    // Simulate a high attempt number to force 'capped' to be maxDelayMs
    const decision = getRetryDecision(1, true, { ...defaultRetryPolicy, baseDelayMs: 6000 });
    // Wait, if baseDelayMs is 6000, capped is 5000.
    // jitter = 1000.
    // range = 4000 to 6000.

    if (decision.delayMs > defaultRetryPolicy.maxDelayMs) {
        console.log(`Exceeded maxDelayMs! Delay: ${decision.delayMs}, Max: ${defaultRetryPolicy.maxDelayMs}`);
        exceeded = true;
        break;
    }
}

if (!exceeded) {
    console.log("Did not exceed maxDelayMs in 1000 iterations (might be luck or logic is tighter than thought).");
    // Let's try explicitly with the formula analysis
    // capped = 5000
    // jitter = 1000
    // max possible = 6000
}

// Let's print a few values with the default policy at attempt 5 (250 * 16 = 4000)
// 4000 is < 5000.
// Attempt 6 (250 * 32 = 8000) -> capped at 5000.
console.log("--- Attempt 6 (High Delay) ---");
for(let i=0; i<5; i++) {
    const d = getRetryDecision(6, true, defaultRetryPolicy);
    console.log(`Delay: ${d.delayMs}`);
    if (d.delayMs > defaultRetryPolicy.maxDelayMs) {
         console.log("  -> VIOLATION");
    }
}
