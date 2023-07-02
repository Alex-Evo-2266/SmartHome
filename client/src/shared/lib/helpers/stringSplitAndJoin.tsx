export const splitValue = (value: string) => {
    if(value === '')
        return []
    return value.split(",").map(item=>item.trim())
}

export const joinValue = (value: string[]) => {
    return value.join(", ")
}