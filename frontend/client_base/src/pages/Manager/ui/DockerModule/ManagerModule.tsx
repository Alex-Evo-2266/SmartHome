import { useModulesAPI } from '@src/entites/moduleManager';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { useAppDispatch } from '@src/shared/lib/hooks/redux';
import { showBaseMenu } from '@src/shared/lib/reducers/menuReducer';
import { Loading } from '@src/shared/ui/Loading';
import { ArrowLeft, Button, Check, IconButton, ListContainer, ListItem, MoreVertical, Panel, Typography, X } from 'alex-evo-sh-ui-kit';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const DockerModule:React.FC = () => {

    const {getModule, loading, installModule, runModule, deleteModule, stopModule, rebuildModule, updateModule} = useModulesAPI()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name } = useParams<{module_name: string}>();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])

    const clickExempl = (name: string) => {
        navigate(`/manager/docker/${module_name}/${name}`)
    }

    const install = async () => {
        if(!module_name) return
        await installModule(module_name)
        setTimeout(()=>load(),100)
    }

    const click = (f: (...arg: string[])=>void, ...arg: string[]) => {
        return () => {
            f(...arg)
            setTimeout(load, 100)
        }
    }
    
    useEffect(()=>{
        load()
    },[load])

    const getMenuItems = (status: string, name: string) => {
        if(status === "true")
            return [
                    {title: "остановка", onClick: click(stopModule, name)},
                    {title: "пересборка", onClick: click(rebuildModule, name)},
                    {title: "обновить", onClick: click(updateModule, name)}
                ]
        return[
            {title: "запуск", onClick: click(runModule, name)},
            {title: "удалить", onClick: click(deleteModule, name)},
            {title: "пересборка", onClick: click(rebuildModule, name)},
            {title: "обновить", onClick: click(updateModule, name)}
        ]
    }

    const showMenu = (e:React.MouseEvent<HTMLButtonElement>, status: string, name: string) => {
        dispatch(showBaseMenu(getMenuItems(status, name), e.clientX, e.clientY))
    }

    if(loading)
        return(
            <Loading></Loading>
        )

    if(!modules)
    {
        return(
            <div className="manager-page">
                <Panel>
                    <IconButton icon={<ArrowLeft/>} onClick={()=>navigate(-1)}/>
                    <Typography type="title">{module_name}</Typography>
                    <Typography type="body">модуль не найден</Typography>
                </Panel>
            </div>
        )
    }

    return(
        <>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography type="title">{module_name}</Typography>
            <Button onClick={install}>Установка</Button>
        </div>
        <ListContainer>
        {
            modules.load_module_name.map(item=>(
                <ListItem 
                    hovered 
                    onClick={()=>clickExempl(item.name)}
                    header={item.name} 
                    icon={String(!!item.status?.all_running)==="true"?<Check/>: <X/>} 
                    control={<IconButton icon={<MoreVertical/>} onClick={(e: React.MouseEvent<HTMLButtonElement>)=>showMenu(e, String(!!item.status?.all_running), item.name)}/>}
                    // control={<IconButtonMenu 
                    //     blocks={[{items:getMenuItems(String(!!item.status?.all_running), item.name)}]} 
                    //     icon={<MoreVertical/>}
                    // />}
                />
            ))
        }
        </ListContainer>
        </>
                
    )
}