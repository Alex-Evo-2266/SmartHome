import { useCallback, useEffect, useState } from "react"
import { Loading } from "@src/shared/ui/Loading"
import { FAB, Panel, Plus, Tabs } from "alex-evo-sh-ui-kit"
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Manager.scss'
import { useCoreAPI, useCoreModulesAPI, useModulesAPI } from "@src/entites/moduleManager";
import { CoreContainerId, ModuleData } from "@src/entites/moduleManager/modules/modules";
import { ManagerContext } from "../lib/context";

const TabsItems = [
    {
        label: "docker module",
        path: "docker"
    },
    {
        label: "core module",
        path: "core-module"
    },
    {
        label: "core",
        path: "core"
    }
]

export const ManagerPage = () => {

    const {getModulesAll, loading} = useModulesAPI()
    const location = useLocation();
    const {getModulesAll:getModulesCoreAll, loading:loadingCoreModule} = useCoreModulesAPI()
    const {getModulesAll:getCoreAll, loading:loadingCore} = useCoreAPI()
    const [allModules, setModules] = useState<ModuleData[]>([])
    const [allCoreModules, setCoreModules] = useState<ModuleData[]>([])
    const [allCore, setCore] = useState<CoreContainerId[]>([])
    const navigate = useNavigate()
    const pathParts = location.pathname.split('/'); // разобьет путь на части
    const subRoute = pathParts[2];

    const load = useCallback(async(no_cash:boolean = false)=>{
        const data = await getModulesAll(no_cash)
        const dataCoreModule = await getModulesCoreAll(no_cash)
        const dataCore = await getCoreAll()
        if(data)
            setModules(data.data)
        if(dataCoreModule)
            setCoreModules(dataCoreModule.data)
        if(dataCore)
            setCore(dataCore.data)
    },[getModulesAll])

    useEffect(()=>{
        load()
    },[load])

    const clickModule = (index:number) => {
        navigate(`/manager/${TabsItems[index].path}`)
    }

    const getIndex = (route: string) => {
        const index = TabsItems.findIndex(item=>item.path === route)
        if(index < 0)
            return 0
        return index
    }

    if(loading || loadingCore || loadingCoreModule)
        return(
            <Loading></Loading>
    )

    return (
        <div className="manager-page">
            <ManagerContext.Provider value={{dockerModules:allModules, coreModuler:allCoreModules, core:allCore, reload: load}}>
                <Panel>
                    <Tabs 
                        activeTabIndex={getIndex(subRoute)} 
                        onTabClick={clickModule} 
                        tabs={TabsItems.map(item=>({label:item.label, content:<div/>}))}
                    />
                    <Outlet/>
                </Panel>
            </ManagerContext.Provider>
            
            <FAB onClick={()=>load(true)} icon={<Plus primaryColor="var(--On-primary-container-color)"/>}>reload</FAB>
        </div>
    )
}