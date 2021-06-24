export default [
  { name: 'Decimal', regex: new RegExp('^\\d*\\.\\d*$').toString() },
  { name: 'Integer', regex: new RegExp('^\\d*$').toString() },
  { name: 'Email', regex: new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').toString() },
  {
    name: 'URL',
    regex: new RegExp(
      '^[(http(s)?)://(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$'
    ).toString(),
  },
  { name: 'Alpha', regex: new RegExp('^\\w$').toString() },
  { name: 'Alphanumeric', regex: '^a-zA-Z0-9$' },
  { name: 'None' },
]
