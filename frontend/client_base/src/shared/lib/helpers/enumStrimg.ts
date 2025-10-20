

export function splitEnum(value: string, sep: string = ','){
    return value.split(sep).map(item=>item.trim())
}

export function joinEnum(values: string[], sep: string = ','){
    return values.join(sep)
}