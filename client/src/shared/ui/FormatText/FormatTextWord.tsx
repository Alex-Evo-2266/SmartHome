import { Fragment, useState } from 'react'
import { IDictFormatTextInfo } from '../../model/FormatText'
import './FormatText.scss'

const DEF_COLOR = ""

interface IFormatTextProps{
    data: string[]
    dict: IDictFormatTextInfo[] | undefined
}

interface IWord{
    text: string
    color: string,
    info?: string
}

interface InfoState{
    text: string
    x: number
    y: number
}

export const FormatTextWord = ({dict, data}:IFormatTextProps) => {

    const [info, setInfo] = useState<InfoState | null>(null)

    const getColor = (data: string[]):IWord[] => {
        if (!dict)
            return data.map(item=>({text:item, color:DEF_COLOR}))
        let dictConf = dict
        let newArr:IWord[] = []
        for (let index = 0; index < data.length; index++) {
            let flag = true
            for (const item of dictConf) {
                if (item.data === data[index])
                {
                    newArr.push({text: data[index], color: item.color || DEF_COLOR, info: item.text})
                    dictConf = item.list || []
                    flag = false
                    break
                }
            }
            if (flag){
                newArr.push({text:data[index], color:DEF_COLOR})
                dictConf = []
            }
        }
        return newArr
    }

    const showTextInfo = (e: React.MouseEvent<HTMLSpanElement>, info: string | undefined) => {
        if(!info)
            return
        setInfo({text: info, x: e.clientX, y: e.clientY})
        /*
        подсказки еще не реализованны
        */
    }

    return(
        <>
        {
            getColor(data).map((item, index)=>(
                <Fragment key={index}>
                {(index !== 0)?<span className='text-format-dot'>.</span>:null}
                <span className='text-format-word' style={{backgroundColor:item.color}} onMouseOver={event=>showTextInfo(event, item.info)} onMouseOut={()=>setInfo(null)}>
                    {item.text}
                </span>
                </Fragment>
                
            ))
        }
        </>       
    )
}