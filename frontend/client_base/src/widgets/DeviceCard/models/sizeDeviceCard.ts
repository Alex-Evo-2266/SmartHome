import { ScreenSize } from "alex-evo-sh-ui-kit"

interface ICardSize{
    defaultSize: number
    mobile?: number
    standart?: number
    big?: number
}

const DEFAULT_SIZE: ICardSize = {
    defaultSize: 300,
    mobile: 200,
}

const LIGHT_SIZE: ICardSize = {
    defaultSize: 500,
    mobile: 200
}

const types:{[key:string]:ICardSize} = {
    DEFAULT_SIZE,
    light: LIGHT_SIZE
}

export function cardSize(screenSize: ScreenSize, type = "DEFAULT_SIZE"){
    const size = type && type in types? types[type]: DEFAULT_SIZE
    if(screenSize === ScreenSize.BIG_SCREEN)
        return size.big ?? size.defaultSize
    if(screenSize === ScreenSize.STANDART)
        return size.standart ?? size.defaultSize
    if(screenSize === ScreenSize.MOBILE)
        return size.mobile ?? size.defaultSize
    return size.defaultSize
}

export function cardSizePX(screenSize: ScreenSize, type = "DEFAULT_SIZE"){
    return `${cardSize(screenSize, type)}px`
}

export function cardSizeStyle(screenSize: ScreenSize, type = "DEFAULT_SIZE"):React.CSSProperties{
    return {width: cardSizePX(screenSize, type)}
}