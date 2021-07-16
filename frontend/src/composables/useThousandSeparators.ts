/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import formatThousands from 'format-thousands';

export default function (input: number) {
  return formatThousands(input, ',');
}
