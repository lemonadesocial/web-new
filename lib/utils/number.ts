export function formatNumber(num: number): string {
  if (isNaN(num)) return "NaN";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs === 0) return "0";

  let formatted: string;

  if (abs >= 1e12) {
      const value = (num / 1e12).toFixed(3).replace(/\.?0+$/, '');
      formatted = value + "T";
  } else if (abs >= 1e9) {
      const value = (num / 1e9).toFixed(3).replace(/\.?0+$/, '');
      formatted = value + "B";
  } else if (abs >= 1e6) {
      const value = (num / 1e6).toFixed(3).replace(/\.?0+$/, '');
      formatted = value + "M";
  } else if (abs < 1e-6) {
      const expStr = abs.toExponential(5);
      const [mantStr, expPart] = expStr.split('e');
      let mant = mantStr.replace('.', '');
      mant = mant.replace(/0+$/, '');
      mant = mant.slice(0, 3);
      const exp = parseInt(expPart, 10);
      const zeros = -exp - 1;
      formatted = `0.0×(${zeros})${mant}`;
  } else if (abs < 1) {
      const precision = abs.toPrecision(3);
      if (precision.includes('e')) {
          const [_, expPart] = precision.split('e');
          const exp = parseInt(expPart, 10);
          const decimalPlaces = Math.abs(exp) + 2;
          formatted = num.toFixed(decimalPlaces).replace(/\.?0+$/, '') || '0';
      } else {
          formatted = precision.replace(/\.?0+$/, '') || '0';
      }
  } else {
      formatted = num.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3
      });
  }

  return sign + formatted;
}
