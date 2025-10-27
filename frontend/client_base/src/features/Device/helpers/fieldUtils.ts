export function getInitData(high:string|null|undefined, value:string|null|undefined){
    high=high
    // if(!high && value == "1")
    //     return true
    // if(high && value == high)
    //     return true
    if(value == "1")
        return true
    return false  
}

export function getData(high:string|null|undefined, low:string|null|undefined, value:string|null|undefined, old:boolean){
    high=high
    low=low
    // if(!high && value == "1")
    //     return true
    // if(high && value == high)
    //     return true
    // if(!low && value == "0")
    //     return false
    // if(low && value == low)
    //     return false
    if(value == "0")
        return false
    if(value == "1")
        return true
    return old
}

export function getOutData(high:string|null|undefined, low:string|null|undefined, value:boolean){
    if(value && !high)
        return "1"
    if(value && high)
        return high
    if(!value && !low)
        return "0"
    if(!value && low)
        return low
    return "0"
}