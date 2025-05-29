export function joinAutomation(args: (string | undefined)[], options?:string){
    const argsFiltered = args.filter(item=>item !== undefined && item !== "")
    let str = argsFiltered.join('.')
    if(options)
    {
        str += `[${options}]`
    }
    return str
}