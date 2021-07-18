export default function (input: number) {
  return input.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}
