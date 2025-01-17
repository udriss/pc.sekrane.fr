export const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60000, // 1 minute

  check(resourceId: string): boolean {
    const deviceId = localStorage.getItem('deviceFingerprint');
    if (!deviceId) return true; // Allow if fingerprint not yet generated
    const key = `rateLimit_${deviceId}_${resourceId}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();

    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ attempts: 1, timestamp: now }));
      return true;
    }

    const data = JSON.parse(stored);
    if (now - data.timestamp > this.windowMs) {
      localStorage.setItem(key, JSON.stringify({ attempts: 1, timestamp: now }));
      return true;
    }

    if (data.attempts >= this.maxAttempts) {
      return false;
    }

    data.attempts += 1;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
};