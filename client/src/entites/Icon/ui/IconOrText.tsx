import { icons } from "../models/icons"

interface Props{
    iconName: string
}

function IconOrString({iconName}:Props) {
    if(iconName in icons)
    {
        const Icon = icons[iconName]
        return (<Icon/>)
    }
    return <>{iconName}</>
}

export {IconOrString}