export function normalizeName(str) {
  if (!str) return null
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/\s+/g, ' ')            // espaces multiples -> 1 espace
}