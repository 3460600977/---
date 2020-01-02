export function toThousands(num, hasZero = false) {
  num = (num || 0).toString();
  let prefixInt = num.split('.')[0];
  let suffixDecimal = num.split('.')[1] || '00';
  let result = '';
  while (prefixInt.length > 3) {
    result = ',' + prefixInt.slice(-3) + result;
    prefixInt = num.slice(0, prefixInt.length - 3);
  }
  if (prefixInt) {
    result = prefixInt + result;
  }
  if (hasZero) return result + '.' + suffixDecimal;
  else return result
}
