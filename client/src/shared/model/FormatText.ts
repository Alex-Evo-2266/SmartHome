// export interface IDictFormatText{
//     [key: string]: IDictFormatTextInfo | string
// }

export interface IDictFormatTextInfo{
    list?: IDictFormatTextInfo[]
    data: string
    color?: string
    text?: string
}