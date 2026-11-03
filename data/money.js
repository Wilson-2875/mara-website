
export function calculatePercentChange(currentPrice, previousPrice){
  return Math.round(((currentPrice - previousPrice)/previousPrice) * 100).toFixed(0);
}
