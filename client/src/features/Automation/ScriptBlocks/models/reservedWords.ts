import { IDictFormatTextInfo } from "../../../../shared/model/FormatText"


export const LOGIC = ["true", "false", "on", "off"]
export const SIGN_CONDITION = ["==", ">=", "<=", "<", ">"]
export const SIGN_ACTION = ["="]
export const SIGN_MATH = ["+", "-", "/", "*"]
export const MATH = ["abs", "round", "floor", "ceil"]



export const logic: IDictFormatTextInfo[] = LOGIC.map(item=>({data:item, textColor:"#3838FF"}))
export const signCondition: IDictFormatTextInfo[] = SIGN_CONDITION.map(item=>({data:item, textColor:"var(--On-surface-color)"}))
export const signAction: IDictFormatTextInfo[] = SIGN_ACTION.map(item=>({data:item, textColor:"var(--On-surface-color)"}))
export const signMath: IDictFormatTextInfo[] = SIGN_MATH.map(item=>({data:item, textColor:"var(--On-surface-color)"}))
export const mathFunction: IDictFormatTextInfo[] = MATH.map(item=>({data:item, textColor:"#D3A000", function: true}))