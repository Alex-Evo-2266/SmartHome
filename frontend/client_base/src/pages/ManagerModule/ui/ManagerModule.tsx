import { ArrowLeft, IconButton, ListContainer, ListItem, Panel, Typography } from 'alex-evo-sh-ui-kit';
import './ManagerModule.scss'
import { useParams } from 'react-router-dom';
import { useModulesAPI } from '@src/entites/moduleManager';
import { useCallback, useEffect, useState } from 'react';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { Loading } from '@src/shared/ui/Loading';
import { useNavigate } from 'react-router-dom';

export const ManagerModulePage:React.FC = () => {

    const {getModule, loading} = useModulesAPI()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name } = useParams<{module_name: string}>();
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])

    const clickContainer = (data: string) => {
        navigate(`/manager/${module_name}/${data}`)
    }
    
    useEffect(()=>{
        load()
    },[load])

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
                <Typography type="body">Контейнеры</Typography>
                <ListContainer>
                {
                    modules.containers.map(item=>{
                        return(
                            <ListItem onClick={()=>clickContainer(item.name)} header={item.name}/>
                        )
                    })
                }
                </ListContainer>
            </Panel>
        </div>
    )
}