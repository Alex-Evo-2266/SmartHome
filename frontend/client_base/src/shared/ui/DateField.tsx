import {DateField as DF} from "alex-evo-sh-ui-kit"

import {MENU_ROOT_ID} from '../../const'

interface ITimeFieldProps {
    onChange?: (value: string) => void;
    name?: string;
    value?: string;
    validEmptyValue?: boolean;
    className?: string;
    error?: boolean;
    border?: boolean;
}

export const DateField = (props:ITimeFieldProps) => {
    return <DF {...{...props}} container={document.getElementById(MENU_ROOT_ID)}/>
}