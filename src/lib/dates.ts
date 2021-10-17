/**
 * Adds an amount of seconds to a Date object
 * @param date a Date object
 * @param seconds a number of seconds to add
 * @returns a new Date object with `seconds` added.
 */
export function dateAddDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}
