import currency from "currency.js";
export function toCurrency(value: any) {
  return currency(value, {
    // decimal: 2,
    precision: 0,
    symbol: "Rp.",
  }).format();
}
