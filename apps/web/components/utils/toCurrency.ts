import currency from "currency.js";
export function toCurrency(value: any, symbol: string | null = "Rp.") {
  return currency(value, {
    // decimal: 2,
    precision: 0,
    symbol: symbol || "",
  }).format();
}
