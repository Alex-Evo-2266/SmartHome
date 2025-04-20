export function getBooleanFieldStatus(data: string, high?: string, low?: string){
    if(low && data === low)
        return false
    if(high && data === high)
        return true
    if(!high && data === "1")
        return true
    if(!low && data === "0")
        return false
    return false
}