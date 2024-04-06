import './ScriptsConstructor.scss'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Script, ScriptBlockType, widthContainerCalculate } from '../../../entites/Script'
import { ScriptBlockAction } from '../../../features/Automation/ScriptBlocks/ui/ScriptBlockAction'
import { ScriptBlockCondition } from '../../../features/Automation/ScriptBlocks/ui/ScriptBlockCondition'
import { WIDTH } from '../../../entites/Script/models/const'
import { ScriptBlock } from '../../../entites/Script/models/script'
import { ScriptAddBlock } from '../../../features/Automation/ScriptBlocks/ui/AddBlock'
import { BigContainer, FAB } from '../../../shared/ui'
import { Home } from 'lucide-react'
import { IPoint } from '../../../shared/model/point'
import { useAddBlock } from '../../../entites/Script/lib/hooks/addBlock.hook'
import { useLinesСanvas } from '../../../entites/Script'
import { StartScriptBlock } from '../../../widgets/StartScriptBlock/ui/StartScriptBlock'
import { AutomationEntityData } from '../../../entites/Automation'

export const ScriptsConstructorPage = () => {

    const {addBlock} = useAddBlock()
    const canvas = useRef<HTMLCanvasElement>(null)
    const {Canvas, update} = useLinesСanvas({})
    const container = useRef<HTMLDivElement>(null)
    const [move, setMove] = useState<IPoint>({x:0, y:0})
    const [script, setScript] = useState<Script>({
        blocks:[],
        system_name:"",
        name:""
    })

    const addBlockHandler = useCallback((index:number) => {
        addBlock(index, script.blocks, newBlocks=>{
            setScript(prev=>{
                return {...prev, blocks:newBlocks}
            })
        })
    },[script, addBlock])

    const editBlockHandler = useCallback((index:number, data: ScriptBlock) => {
        let arr = script.blocks.slice()
        arr[index] = data
        setScript(prev=>({...prev, blocks:arr}))
    },[script])

    const deleteHandler = useCallback((index: number)=>{
        let arr1 = (script.blocks ?? []).slice(0, index)
        let arr2 = (script.blocks ?? []).slice(index + 1)
        setScript({...script, blocks: [...arr1, ...arr2]})
    },[script])

    const moveHome = useCallback(()=>{
        setMove({x:widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), y:50})
    },[script])

    const save = useCallback((trigger: AutomationEntityData[], name: string, systemName: string)=>{
        
    },[])

    useEffect(()=>{
        if(container.current)
            update(container.current)
    },[container.current, canvas.current, script])

    useEffect(()=>{
        console.log(script)
    },[script])

    return(
        <BigContainer id="scripts-constructor-page" pozMove={move}>
            <Canvas/>
            <div ref={container} id='scripts-constructor-container'>
                <StartScriptBlock save={save}/>
                <ScriptAddBlock onClick={addBlockHandler} index={0} />
            {
                script.blocks.map((item, index)=>{
                    if(item.type == ScriptBlockType.ACTION)
                        return(
                        <Fragment key={index}>
                            <ScriptBlockAction del={()=>deleteHandler(index)} edit={newData=>editBlockHandler(index, newData)} data={{...item}}/>
                            <ScriptAddBlock onClick={addBlockHandler} index={index + 1} />
                        </Fragment>
                        )
                    else if(item.type == ScriptBlockType.CONDITION)
                        return(
                        <Fragment key={index}>
                            <ScriptBlockCondition del={()=>deleteHandler(index)} edit={newData=>editBlockHandler(index, newData)} data={{...item}}/>
                            <ScriptAddBlock onClick={addBlockHandler} index={index + 1} />
                        </Fragment>
                        )
                })
            }
            </div>
            <FAB icon={<Home/>} onClick={moveHome}></FAB>
        </BigContainer>
    )
}