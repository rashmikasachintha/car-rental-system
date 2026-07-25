/**
 * Formats a numeric amount as Sri Lankan Rupees, e.g. formatLKR(4500) -> "LKR 4,500.00"
 */
export const formatLKR = (amount) => {
  const value = Number(amount) || 0;
  return `LKR ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
