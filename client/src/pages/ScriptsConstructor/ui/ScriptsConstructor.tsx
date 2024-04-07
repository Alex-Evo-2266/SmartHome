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
import { AutomationData, AutomationEntityData, Condition } from '../../../entites/Automation'
import { useAPIScript } from '../api/APIScript'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppAutomation } from '../../../widgets/AutomationForm'
import { useGetAutomations } from '../api/apiAutomations'
import { TypeEntityAction } from '../../../entites/Automation/models/AutomationData'

const POSTFIX = "automation"

export const ScriptsConstructorPage = () => {

    let params = useParams();
    const navigate = useNavigate()
    const {addBlock} = useAddBlock()
    const {addAutomation} = useAppAutomation()
    const APIScript = useAPIScript()
    const APIAutomation = useGetAutomations()
    const canvas = useRef<HTMLCanvasElement>(null)
    const {Canvas, update} = useLinesСanvas({})
    const container = useRef<HTMLDivElement>(null)
    const [move, setMove] = useState<IPoint>({x:0, y:0})
    const [triggers, setTrigger] = useState<AutomationEntityData[]>([])
    const [script, setScript] = useState<Script>({
        blocks:[],
        system_name:"",
        name:""
    })

    const getScriptF = useCallback(async ()=>{
        const system_name = params["system_name"]
        if (system_name)
        {
            const data = await APIScript.getScript(system_name)
            console.log(data)
            setScript(data)
        }
    },[APIScript.getScript, params])

    const getTriggerF = useCallback(async ()=>{
        const system_name = params["system_name"]
        if (system_name)
        {
            const data:AutomationData | null = await APIAutomation.getAutomation(`${system_name}.${POSTFIX}`)
            setTrigger(data?.triggers ?? [])
        }
    },[APIAutomation.getAutomation, params])

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

    const save = useCallback(async (triggers: AutomationEntityData[], name: string, systemName: string)=>{
        const data:AutomationData = {name:`${systemName}.${POSTFIX}`, system_name:`${systemName}.${POSTFIX}`, triggers:triggers, condition:Condition.AND, conditions:[], actions:[{type_entity:TypeEntityAction.SCRIPTS, entity:"script", value:systemName}], differently:[], status:true}
        if(params["system_name"])
            await APIScript.editScript({blocks: script.blocks, name, system_name: systemName}, params["system_name"])
        else
            await APIScript.addScript({blocks: script.blocks, name, system_name: systemName})
        if(triggers.length > 0 && params["system_name"])
            await APIAutomation.editOrCreateAutomation(data, `${params["system_name"]}.${POSTFIX}`)
        else if(triggers.length > 0)
            await addAutomation(data)
        else if(triggers.length == 0)
            await APIAutomation.deleteAutomation(`${params["system_name"]}.${POSTFIX}`)
        navigate(`/scripts`)
    },[APIScript.addScript, APIScript.editScript, APIAutomation.editOrCreateAutomation, APIAutomation.deleteAutomation, script])

    useEffect(()=>{
        if(container.current)
            update(container.current)
    },[container.current, canvas.current, script])

    useEffect(()=>{
        getScriptF()
    },[getScriptF])

    useEffect(()=>{
        getTriggerF()
    },[getTriggerF])

    if (APIAutomation.loading || APIScript.loading)
        return(<div></div>)

    return(
        <BigContainer id="scripts-constructor-page" pozMove={move}>
            <Canvas/>
            <div ref={container} id='scripts-constructor-container'>
                <StartScriptBlock save={save} name={script.name} system_name={script.system_name} triggers={triggers}/>
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