/**
 * Threshold for linear interpolation (~8 weeks / 56 days in years)
 * Below this age, the logarithmic formula gives values < 1, so we use linear interpolation
 */
export const MIN_FORMULA_AGE_YEARS = 8 / 52; // ~0.154 years

/**
 * Calculates human equivalent age for a dog using epigenetic clock formula
 * Based on UC San Diego research (2020)
 * Formula: humanAge = 16 * ln(dogAge) + 31
 *
 * For puppies younger than 8 weeks, uses linear interpolation from 0 to the formula value at 8 weeks
 *
 * @param dogAgeInYears - Dog's age in years (can be decimal, e.g., 2.5 for 2 years 6 months)
 * @returns Human equivalent age in years
 */
export const calculateHumanAge = (dogAgeInYears: number): number => {
  if (dogAgeInYears <= 0) return 0;

  // For puppies < 8 weeks, use linear interpolation
  // from 0 to the formula value at 8 weeks (~1.1 human years)
  if (dogAgeInYears < MIN_FORMULA_AGE_YEARS) {
    const humanAgeAtThreshold = 16 * Math.log(MIN_FORMULA_AGE_YEARS) + 31;
    return (dogAgeInYears / MIN_FORMULA_AGE_YEARS) * humanAgeAtThreshold;
  }

  return 16 * Math.log(dogAgeInYears) + 31;
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
