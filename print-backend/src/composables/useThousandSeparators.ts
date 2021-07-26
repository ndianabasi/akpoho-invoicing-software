export default function (input: number, decimalPlaces?: number) {
  const minimumFractionDigits = decimalPlaces ?? 2;
  const inputNumber = input ?? 0;
  return inputNumber.toLocaleString(undefined, {
    minimumFractionDigits,
    useGrouping: true,
  });
}
