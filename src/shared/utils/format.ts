export function formatMoneyFromCents(cents: number, currency = "$") {
  return `${currency}${(cents / 100).toFixed(2)}`;
}

export function formatDateTime(input: string | number | Date) {
  return new Date(input).toLocaleString();
}

export function hashToInt(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function sumQuantity(items: Array<{ quantity: number }>) {
  return items.reduce((sum, it) => sum + it.quantity, 0);
}

