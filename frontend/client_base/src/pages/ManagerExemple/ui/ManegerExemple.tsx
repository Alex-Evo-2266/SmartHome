import { ArrowLeft, Button, IColumn, IconButton, ListContainer, ListItem, Panel, Table, Typography } from 'alex-evo-sh-ui-kit';
import { useParams } from 'react-router-dom';
import { useModulesAPI } from '@src/entites/moduleManager';
import { useCallback, useEffect, useState } from 'react';
import { Exemple, ModuleData } from '@src/entites/moduleManager/modules/modules';
import { Loading } from '@src/shared/ui/Loading';
import { useNavigate } from 'react-router-dom';

export const ManagerExemplePage:React.FC = () => {

    const {stopModule, runModule, getModule, loading, installModule} = useModulesAPI()
    const [module, setModule] = useState<{module: ModuleData, exempl?: Exemple} | null>(null)
    const { module_name, module_exempl } = useParams<{module_name: string, module_exempl: string}>();
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data){
            const exempl = data.load_module_name.find(item=>item.name === module_exempl)
            setModule({module: data, exempl: exempl})
        }
    },[getModule, module_name, module_exempl])

    const clickContainer = (data: string) => {
        navigate(`/manager/${module_name}/${data}`)
    }

    const click = useCallback((f: (...arg: string[]) => void, ...arg: string[]) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        f(...arg)
        setTimeout(load, 100)
    }
}, [load])

    const install = async () => {
        if(!module_name) return
        await installModule(module_name)
        setTimeout(()=>load(),100)
    }

    const tableCol: IColumn[] = [
            {
                title: "Название контейнера",
                field: "name"
            },
            {
                title: "статус",
                field: "status"
            },
            {
                title: "действия",
                field: "active",
                template(_, data) {
                    if(!module_exempl)
                        return(<></>)
                    if(["exited", "dead"].includes(data.status as string))
                    {
                        return(
                            <>
                            <Button onClick={click(runModule, module_exempl, data.name as string)}>старт</Button>
                            </>
                        )
                    }
                    else{
                        return(
                            <>
                            <Button onClick={click(stopModule, module_exempl, data.name as string)}>стоп</Button>
                            </>
                        )
                    }
                },
            }
        ]
    
    useEffect(()=>{
        load()
    },[load])

    if(loading)
        return(
            <Loading></Loading>
        )

    if(!module || !module.exempl)
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
                <Typography type="title-2">{module_exempl}</Typography>
                {
                    module.exempl.status &&
                    <Table columns={tableCol} data={module.exempl.status.containers.map(item=>({name: item.name, status: item.state}))}/>
                }
            </Panel>
        </div>
    )
}