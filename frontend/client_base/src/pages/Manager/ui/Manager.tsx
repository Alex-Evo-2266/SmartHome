import { useCallback, useEffect, useState } from "react"
import { Loading } from "@src/shared/ui/Loading"
import { ArrowLeft, Check, FAB, IconButton, ListContainer, ListItem, Panel, Plus } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import './Manager.scss'
import { useModulesAPI } from "@src/entites/moduleManager";
import { AllModulesData, ModuleData } from "@src/entites/moduleManager/modules/modules";


export const ManagerPage = () => {

    const {getModulesAll, loading} = useModulesAPI()
    const [allModules, setModules] = useState<ModuleData[]>([])
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        const data = await getModulesAll()
        if(data)
            setModules(data.data)
    },[getModulesAll])

    useEffect(()=>{
        load()
    },[load])

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/${data.name_module}`)
    }

    if(loading)
        return(
            <Loading></Loading>
    )

    return (
        <div className="manager-page">
            <Panel>
                <IconButton icon={<ArrowLeft/>} onClick={()=>navigate(-1)}/>
                <ListContainer>
                    {
                        allModules.map((data)=>{
                            return(
                            <ListItem onClick={()=>clickModule(data)} header={data.name_module} text={data.repo} icon={data.load? <Check primaryColor="#00aa00"/>: <i></i>}>
                            </ListItem>
                            )
                        })
                    }
                </ListContainer>
            </Panel>
            <FAB icon={<Plus/>}/>
        </div>
    )
}