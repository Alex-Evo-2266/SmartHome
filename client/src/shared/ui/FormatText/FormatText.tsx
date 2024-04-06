import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
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
    const textBox = useRef<HTMLDivElement | null>(null)
    const [focus, setFocus] = useState<boolean>(false)
    const textareaElement = useRef<HTMLTextAreaElement>(null)

    useEffect(()=>{
        if (value)
            setText(String(value))
    },[value])

    const resize = useCallback(() => {
        if (textBox.current && textareaElement.current)
            if(textBox.current.offsetHeight >  textareaElement.current.offsetHeight + 22)
                textareaElement.current.style.height = textBox.current.offsetHeight + "px"
    },[])

    const change = useCallback((event: React.ChangeEvent<HTMLDivElement>) => {
        console.log(event)
        // let e:React.ChangeEvent<HTMLDivElement> = 
        // console.log(event)
        // setText(event.target.value)
        // onChange && onChange(event)
        // setTimeout(resize, 0)
    },[])

    const focusHandler = () => {
        if(!textareaElement.current)
            return
        textareaElement.current.focus()
        setFocus(true)
    }

    const blurHandler = () => {
        if(!textareaElement.current)
            return
        textareaElement.current.blur()
        setFocus(false)
    }

    const splitCommands = (str:string) => str.split('\n').map(item=>splitCommand(item))

    const splitCommand = (str:string) => {
        str.split(' ').map(item=>splitCommandFragment(item))
        let arr: string[] = []
        let buff = ""
        let flagSpace = false
        let flagFun = false
        for (let index = 0; index < str.length; index++) {
            if(str[index] === ' ')
            {
                flagSpace = true
                if(!flagFun){
                    arr.push(buff)
                    buff = ""
                }
            }
            else if(str[index] === '(')
            {
                if (!flagSpace)
                    flagFun = true
                flagSpace = false
                buff += '('
            }
            else if(str[index] === ')')
            {
                flagFun = false
                flagSpace = false
                buff += ')'
            }
            else
            {
                flagSpace = false
                buff = buff + str[index]
            }            
        }
        arr.push(buff)
        return arr.map(item=>splitCommandFragment(item))
    }

    const splitCommandFragment = (str:string) => str.split('.')

    useEffect(()=>{
        console.log(splitCommands(text))
    },[text])

    // <textarea
    // ref={textareaElement}
    // readOnly={readOnly}
    // required 
    // className={`${error?"error":""}`} 
    // placeholder={placeholder}
    // name={name} 
    // value={text} 
    // onChange={change}
    // onFocus={onFocus}
    // onBlur={onBlur}/>

    // {
    //     splitCommands(text).map((item, index)=>(<div className='text-format-rows' key={index}>
    //         {
    //         item.map((item2, index2)=>(<div key={index2} className='text-format-el'>
    //             <FormatTextWord key={index2} data={item2} dict={dict}/>
    //             {
    //                 (item.length-1 === index2 && splitCommands(text).length-1 === index && focus)?
    //                 <span className='text-format-curs'>I</span>
    //                 :null
    //             }
    //         </div>))
    //         }
    //     </div>))
    // }

    // const keyDown = useCallback((e:React.KeyboardEvent<HTMLDivElement>) => {
    //     // console.log(e.code)
    //     // setText(prev=>prev+=e.code)
        
    //     setTimeout(()=>{
    //         if (!textBox.current || textBox.current.childNodes.length == 0)
    //             return
    //         let text = ""
    //         textBox.current.childNodes.forEach((item, index, arr)=>{
    //             console.log(item, index, arr.length)
    //             text = (arr.length - 1 > index)?text + item.textContent + "\n":text + item.textContent + ""
    //         })
    //         console.log(text)
    //         console.log(textBox.current.childNodes)
    //         setText(text)
    //     },0)
        
    // },[textBox.current])

    const i = (e: FormEvent<HTMLDivElement>) => {
        // let range = new Range()
        // range.setEnd(e.target as Node, 4)
        // range.setStart(e.target as Node, 4)
        // console.log(e.target.outerText)
        // console.log(e.currentTarget.sel)
        // setText(e.target.outerText)
        // let el: HTMLElement = e.target as HTMLElement
        // document.getSelection()?.addRange(range)
        if (!textBox.current)
            return
        textBox.current.selectionStart = textBox.current.selectionEnd = 10
        let y = document.getElementById("s")
        if (!y)
            return
        e.selectionStart = 0
        e.selectionEnd = 0
    }

    useEffect(()=>{
        if(!textBox.current || text === "")
            return
        let html = text.split("\n").map(item=>`<div class="cm-line">${item}</div>`).join("\n")
        textBox.current.innerHTML = html
    },[text])

    useEffect(()=>{
        if (!textBox.current || textBox.current.childNodes.length > 0)
            return
    },[textBox.current])

    useEffect(()=>{
        if (!textBox.current)
            return
            textBox.current.onselect = el => console.log(el)
            textBox.current.onselectionchange = el => console.log(el)
            textBox.current.onselectstart = el => console.log(el)
    },[textBox.current])

    const foc = (e:React.FocusEvent<HTMLDivElement>) => {
        console.log("p9")
        e.selectionStart = 0
        e.selectionEnd = 0
        if (!textBox.current)
            return
        // textBox.current.onselect = el => console.log(el)
        // textBox.current.onselectionchange = el => console.log(el)
        // textBox.current.onselectstart = el => console.log(el)
    }

    return(
        <div className={`text-format text-area ${border?"border":""} ${transparent?"transparent":""} ${className}`}>
            {
                (icon)?
                <div className="icon-container" onClick={focusHandler} onBlur={blurHandler}>{icon}</div>:
                null
            }
            <div className="textarea-container" onClick={focusHandler} onBlur={blurHandler}>
                <div ref={textBox} 
                    onInput={i}
                    autoCorrect="off" 
                    spellCheck="false" 
                    contentEditable={true} 
                    autoCapitalize="off" 
                    translate="no" 
                    role='textbox' 
                    onFocusCapture={foc}
                    aria-multiline={true} 
                    data-language="castom-script" 
                    className='panel' 
                    onFocus={focusHandler} 
                    onBlur={blurHandler} 
                    onSelect={el=>console.log("p0",el)}
                    onStalledCapture={el=>console.log("p1",el)}
                    onSelectCapture={el=>console.log("p2",el)}
                    />
            </div>
            {
                (onClear)?
                <div className="clear-container"><XCircle onClick={onClear}/></div>:
                null
            }
		</div>
    )
}