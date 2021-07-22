export default function (input: number, decimalPlaces?: number) {
  const minimumFractionDigits = decimalPlaces ?? 2;
  return input.toLocaleString(undefined, {
    minimumFractionDigits,
    useGrouping: true,
  });
}
