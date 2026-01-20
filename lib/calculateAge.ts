/**
 * Calculates human equivalent age for a dog using epigenetic clock formula
 * Based on UC San Diego research (2020)
 * Formula: humanAge = 16 * ln(dogAge) + 31
 *
 * @param dogAgeInYears - Dog's age in years (can be decimal, e.g., 2.5 for 2 years 6 months)
 * @returns Human equivalent age in years
 */
export const calculateHumanAge = (dogAgeInYears: number): number => {
  if (dogAgeInYears <= 0) return 0;
  const result = 16 * Math.log(dogAgeInYears) + 31;
  return Math.max(0, result);
};

/**
 * Converts years, months, and days to decimal years
 *
 * @param years - Full years
 * @param months - Additional months (0-11)
 * @param days - Additional days (0-30)
 * @returns Age in decimal years
 */
export const toDecimalYears = (years: number, months: number, days: number): number => {
  return years + months / 12 + days / 365;
};
