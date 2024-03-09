import { useCallback, useEffect, useRef, useState } from 'react'
import './FormatText.scss'
import { XCircle } from 'lucide-react'
import { FormatTextWord } from './FormatTextWord'
import { IDictFormatTextInfo } from '../../model/FormatText'

interface IFormatTextProps{
    onChange?:(event: React.ChangeEvent<HTMLTextAreaElement>)=>void
    name?: string
    value?: number | string
    placeholder?: string
    validEmptyValue?: boolean
    className?: string
    onFocus?: (event:React.FocusEvent<HTMLTextAreaElement>)=>void
    onBlur?: (event:React.FocusEvent<HTMLTextAreaElement>)=>void
    error?: boolean
    icon?:React.ReactNode
    onClear?: ()=>void
    border?: boolean
    readOnly?: boolean
    transparent?: boolean
    dict?: IDictFormatTextInfo[]
}

export const FormatText = ({transparent, readOnly, border, onClear, icon, onChange, name, value, placeholder, className, onFocus, onBlur, error, dict}:IFormatTextProps) => {

    const [text, setText] = useState<string>("")
    const textareaElement = useRef<HTMLTextAreaElement>(null)
    const panel = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if (value)
            setText(String(value))
    },[value])

    const resize = useCallback(() => {
        if (panel.current && textareaElement.current)
            if(panel.current.offsetHeight >  textareaElement.current.offsetHeight + 22)
                textareaElement.current.style.height = panel.current.offsetHeight + "px"
    },[])

    const change = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(event)
        setText(event.target.value)
        onChange && onChange(event)
        setTimeout(resize, 0)
    },[])

    const focus = () => {
        if(!textareaElement.current)
            return
        textareaElement.current.focus()
    }

    const splitCommands = (str:string) => str.split('\n').map(item=>splitCommand(item))

    const splitCommand = (str:string) => str.split(' ').map(item=>splitCommandFragment(item))

    const splitCommandFragment = (str:string) => str.split('.')

    return(
        <div className={`text-format text-area ${border?"border":""} ${transparent?"transparent":""} ${className}`}>
            {
                (icon)?
                <div className="icon-container" onClick={focus}>{icon}</div>:
                null
            }
            <div className="textarea-container" onClick={focus}>
                <textarea
                ref={textareaElement}
                readOnly={readOnly}
                required 
                className={`${error?"error":""}`} 
                placeholder={placeholder}
                name={name} 
                value={text} 
                onChange={change}
                onFocus={onFocus}
                onBlur={onBlur}/>
                <div className='panel' onFocus={focus} ref={panel}>
                {
                    splitCommands(text).map((item, index)=>(<div className='text-format-rows' key={index}>
                        {
                        item.map((item2, index2)=>(<div key={index2} className='text-format-el'>
                            <FormatTextWord key={index2} data={item2} dict={dict}/>
                            {
                                (item.length-1 === index2 && splitCommands(text).length-1 === index)?
                                <span className='text-format-curs'>I</span>
                                :null
                            }
                        </div>))
                        }
                    </div>))
                }
                </div>
            </div>
            {
                (onClear)?
                <div className="clear-container"><XCircle onClick={onClear}/></div>:
                null
            }
		</div>
    )
}