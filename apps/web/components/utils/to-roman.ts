export function numberToRoman(num: number) {
  const roman: any = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let str = "";

  for (const key in roman) {
    // Calculate how many times the value fits into the number
    const q = Math.floor(num / roman[key]);
    // Append the Roman symbol that many times to the result string
    str += key.repeat(q);
    // Subtract the value from the original number
    num -= q * roman[key];
  }

  return str;
}
