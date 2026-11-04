const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type Weekday = (typeof WEEKDAYS)[number];

const WEEKDAY_TO_NUMBER: Record<Weekday, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function weekdayToNumber(day: string): number | undefined {
  return WEEKDAY_TO_NUMBER[day as Weekday];
}

export function numberToWeekday(value: number): Weekday | undefined {
  return WEEKDAYS[value];
}