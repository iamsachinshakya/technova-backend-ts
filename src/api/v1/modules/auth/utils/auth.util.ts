export const secureCookieOptions = {
  httpOnly: true,
  secure: true,
};


// Convert string like "1d", "10h", "30m" to seconds
export const parseExpiry = (expiry: string): number => {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid expiry format: ${expiry}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value;            // seconds
    case "m": return value * 60;       // minutes
    case "h": return value * 60 * 60;  // hours
    case "d": return value * 60 * 60 * 24; // days
    default: throw new Error(`Unknown time unit: ${unit}`);
  }
}

