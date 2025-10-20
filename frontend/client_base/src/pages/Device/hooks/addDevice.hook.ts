import { useState } from "react"


export const useToggle = () => {

    const [visible, setVisible] = useState<boolean>(false)
    
    const show= () => {
        setVisible(true)
    }

    const hide = () => {
        setVisible(false)
    }

    return{
        hide,
        show,
        visible
    }
}