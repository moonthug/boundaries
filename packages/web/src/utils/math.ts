export function m2ToAcres(m2: number, fractionDigits: number = 2) {
  return (m2 / 4046.8564224).toFixed(fractionDigits);
}
export function m2ToKm2(m2: number, fractionDigits: number = 2) {
  return (m2 / 1000).toFixed(fractionDigits);
}
