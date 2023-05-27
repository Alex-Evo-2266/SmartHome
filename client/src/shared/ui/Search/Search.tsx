import { AlignJustify, ArrowLeft, SearchIcon, X } from "lucide-react"
import "./Search.scss"
import { useRef, useState } from "react"

interface SearchProps{
    onSearch: (data: string)=>void
    onMenu?: ()=>void
    placeholder?: string
}

export const Search = ({onMenu, onSearch, placeholder}:SearchProps) => {

    const inputSearch = useRef<HTMLInputElement>(null)
    const [value, setvalue] = useState<string>("")
    const [focus, setFocus] = useState<boolean>(false)

    const onFocus = () => {
        if(inputSearch.current)
        {
            inputSearch.current.focus()
            setFocus(true)
        }
    }

    const clear = () => {
        console.log("fdgh")
        if(inputSearch.current)
        {
            inputSearch.current.focus()
            inputSearch.current.value=""
        }
        setvalue("")
        setFocus(true)
    }

    const onBlur = () => {
        clear()
        if(inputSearch.current)
        {
            inputSearch.current.blur()
            setFocus(false)
        }
    }

    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setvalue(event.target.value)
    }

    const enter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.code === "Enter")
            onSearch(value)
    }

    return(
        <div className="search-container">
            <div className="search-field">
                {
                    (focus)? 
                    <span onClick={onBlur}><ArrowLeft size={24}/></span>:
                    (onMenu)?
                    <span onClick={onMenu}><AlignJustify size={24}/></span>:
                    null
                }
                <input placeholder={placeholder} type="text" ref={inputSearch} onChange={change} onKeyDown={enter} value={value} onFocus={()=>setFocus(true)}/>
                {
                    (focus)?
                    <span onClick={clear}><X size={24}/></span>:
                    <span onClick={onFocus}><SearchIcon size={24}/></span>
                }
            </div>
        </div>
    )
}