import type { Dayjs } from "dayjs"
import dayjs from "dayjs"

export function useDatePicker() {
  /**
   * Normalise une valeur "date-like" en véritable instance Dayjs.
   *
   * Contexte :
   * - Avec Vue (props, stores, réactivité), un Dayjs peut être "proxyfié"
   *   ou transformé en objet "dayjs-like" (ex: avec une propriété `$d`),
   *   ce qui casse certaines méthodes (`format`, `isAfter`, `clone`, etc.).
   *
   * Cette fonction garantit que :
   * - on retourne toujours un vrai `Dayjs` utilisable en toute sécurité
   * - ou `null` si la valeur est absente ou invalide
   *
   * Stratégie :
   * 1. Dé-proxyfie la valeur si nécessaire
   * 2. Si c'est déjà un Dayjs "propre", on le retourne tel quel
   * 3. Sinon, on reconstruit un Dayjs à partir du `Date` interne (`$d`)
   *    ou de la valeur brute
   */
  const convertToDayjs = (value: DateLike): Dayjs | null => {
    if (!value) return null

    const raw = isProxy(value) ? toRaw(value) : value

    // Si c'est déjà un vrai Dayjs (avec clone), on le garde
    if (dayjs.isDayjs(raw) && typeof raw.clone === 'function') {
      return raw as Dayjs
    }

    // Si c'est un "dayjs-like" (ex: Proxy/Object avec $d), on repart du Date
    const base = (raw as any).$d ?? raw
    const date = dayjs(base)
    return date.isValid() ? date : null
  }

  return { 
    convertToDayjs,
  }
}