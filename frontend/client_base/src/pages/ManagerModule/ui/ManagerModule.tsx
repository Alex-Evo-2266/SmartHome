import { ArrowLeft, Button, Check, IColumn, IconButton, Panel, Table, Typography, X } from 'alex-evo-sh-ui-kit';
import { useParams } from 'react-router-dom';
import { useModulesAPI } from '@src/entites/moduleManager';
import { useCallback, useEffect, useState } from 'react';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { Loading } from '@src/shared/ui/Loading';
import { useNavigate } from 'react-router-dom';

export const ManagerModulePage:React.FC = () => {

    const {getModule, loading, installModule, runModule, deleteModule, stopModule} = useModulesAPI()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name } = useParams<{module_name: string}>();
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])

    const clickExempl = (data: string) => {
        navigate(`/manager/${module_name}/${data}`)
    }

    const install = async () => {
        if(!module_name) return
        await installModule(module_name)
        setTimeout(()=>load(),100)
    }

    const click = (f: (...arg: string[])=>void, ...arg: string[]) => {
        return (e:React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
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
                        <Button onClick={click(stopModule, data.name as string)}>остановка</Button>
                    )
                return(
                    <>
                        <Button onClick={click(runModule, data.name as string)}>запуск</Button>
                        <Button onClick={click(deleteModule, data.name as string)}>удалить</Button>
                        {/* {
                            data.local &&
                            <Button onClick={click(deleteModule, data.name as string)}>создать docker compose</Button>
                        } */}
                    </>
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
        <div className="manager-page">
            <Panel>
                <IconButton icon={<ArrowLeft/>} onClick={()=>navigate(-1)}/>
                <Typography type="title">{module_name}</Typography>
                <br/>
                {
                    modules.load_module_name.length > 0?
                    <>
                        <Button onClick={install}>Установка</Button>
                        <Table columns={tableCol} data={modules.load_module_name.map(item=>({name: item.name, status: String(!!item.status?.all_running), local: String(modules.local)}))}/>
                    </>:
                    <>
                        <Typography type="body">Установка</Typography>
                        <Button onClick={install}>Установка</Button>
                    </>
                }
            </Panel>
        </div>
    )
}