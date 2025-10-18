import { useCallback, useEffect, useState } from "react"
import { Loading } from "@src/shared/ui/Loading"
import { ArrowLeft, Check, FAB, IconButton, ListContainer, ListItem, Panel, Plus, Tabs } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import './Manager.scss'
import { useCoreModulesAPI, useModulesAPI } from "@src/entites/moduleManager";
import { AllModulesData, ModuleData } from "@src/entites/moduleManager/modules/modules";


export const ManagerPage = () => {

    const {getModulesAll, loading} = useModulesAPI()
    const {getModulesAll:getModulesCoreAll, loading:loadingCore} = useCoreModulesAPI()
    const [allModules, setModules] = useState<ModuleData[]>([])
    const [allCoreModules, setCoreModules] = useState<ModuleData[]>([])
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        const data = await getModulesAll()
        const dataCore = await getModulesCoreAll()
        if(data)
            setModules(data.data)
        if(dataCore)
            setCoreModules(dataCore.data)
    },[getModulesAll])

    useEffect(()=>{
        load()
    },[load])

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/${data.name_module}`)
    }

    if(loading || loadingCore)
        return(
            <Loading></Loading>
    )

    return (
        <div className="manager-page">
            <Panel>
                <Tabs tabs={[{
                    label: "docker module",
                    content: 
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
                },{
                    label: "core module",
                    content: 
                    <ListContainer>
                        {
                            allCoreModules.map((data)=>{
                                return(
                                <ListItem onClick={()=>clickModule(data)} header={data.name_module} text={data.repo} icon={data.load? <Check primaryColor="#00aa00"/>: <i></i>}>
                                </ListItem>
                                )
                            })
                        }
                    </ListContainer>
                }]}/>
                
            </Panel>
            <FAB icon={<Plus/>}/>
        </div>
    )
}