import { useModulesAPI } from '@src/entites/moduleManager';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { IconButtonMenu } from '@src/shared';
import { Loading } from '@src/shared/ui/Loading';
import { ArrowLeft, Button, Check, IColumn, IconButton, IDataItem, MoreVertical, Panel, Table, Typography, X } from 'alex-evo-sh-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const DockerModule:React.FC = () => {

    const {getModule, loading, installModule, runModule, deleteModule, stopModule, rebuildModule, updateModule} = useModulesAPI()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name } = useParams<{module_name: string}>();
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])

    const clickExempl = (data: IDataItem) => {
        navigate(`/manager/docker/${module_name}/${data["name"]}`)
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


    const tableCol: IColumn[] = [
        {
            title: "Название экземпляра",
            field: "name"
        },
        {
            title: "статус",
            field: "status",
            template(cell) {
                return(<div>{cell[0].content === "true" ? <Check/>: <X/>}</div>)
            },
        },
        {
            title: "действия",
            field: "action",
            template(_, data) {
                if(data.status === "true")
                    return(
                        <IconButtonMenu icon={<MoreVertical/>} blocks={[
                            {items: [
                                {title: "остановка", onClick: click(stopModule, data.name as string)},
                                {title: "пересборка", onClick: click(rebuildModule, data.name as string)},
                                {title: "обновить", onClick: click(updateModule, data.name as string)}
                            ]}
                        ]}/>
                    )
                return(
                    <IconButtonMenu icon={<MoreVertical/>} blocks={[
                        {items: [
                            {title: "запуск", onClick: click(runModule, data.name as string)},
                            {title: "удалить", onClick: click(deleteModule, data.name as string)},
                            {title: "пересборка", onClick: click(rebuildModule, data.name as string)},
                            {title: "обновить", onClick: click(updateModule, data.name as string)}
                        ]}
                    ]}/>
                )
            },
        }
    ]

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
        {
            modules.load_module_name.length > 0 &&
            <Table 
                onClickRow={clickExempl} 
                columns={tableCol} 
                data={modules.load_module_name.map(
                    item=>({name: item.name, status: String(!!item.status?.all_running), local: String(modules.local)})
                )}
            />
        }
        </>
                
    )
}