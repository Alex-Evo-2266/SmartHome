
export function formatTime(str: string) {
    if(str.length == 1)
        return `0${str}`
    else
        return str
}

export function getFormattedTime(hours: number, minute: number) {
    return `${formatTime(String(hours))}:${formatTime(String(minute))}`
}