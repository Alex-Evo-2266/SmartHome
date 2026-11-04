export function getCurrentDateTime(date:Date): string {
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  export function toLocalDate(isoDate: string): string {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toLocalTime(isoDate: string): string {
    const date = new Date(isoDate);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

type DateTimePart = "date" | "time";

export function updateDateTimeLocal(
  datetime: string,
  type: DateTimePart,
  data: string,
): string {
  const date = new Date(datetime);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Некорректная дата: ${datetime}`);
  }

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (type === "date") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

    if (!match) {
      throw new Error(`Некорректная дата: ${data}`);
    }

    [, year, month, day] = match.map(Number) as [
      number,
      number,
      number,
      number,
    ];
  } else {
    const match = /^(\d{2}):(\d{2})$/.exec(data);

    if (!match) {
      throw new Error(`Некорректное время: ${data}`);
    }

    hours = Number(match[1]);
    minutes = Number(match[2]);
  }

  // Создаём дату в локальном часовом поясе.
  date.setFullYear(year, month - 1, day);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
}