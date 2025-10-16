import { ArrowLeft, IconButton, Panel, Typography } from 'alex-evo-sh-ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import { useModulesAPI } from '@src/entites/moduleManager';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { Loading } from '@src/shared/ui/Loading';

export const ManagerContainerPage = () => {

    const {getModule, loading} = useModulesAPI()
    const navigate = useNavigate()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name, container } = useParams<{module_name: string, container: string}>();
    const containerData = useMemo(()=>{return modules?.containers.find(item=>item.name === container)},[container, modules])

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])
    
    useEffect(()=>{
        load()
    },[load])

    if(loading)
        return(
            <Loading></Loading>
        )

    if(!containerData)
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
                <Typography type="title">Контейнер</Typography>
                <br/>
                <Typography type="body">{containerData.name}</Typography>
                <Typography type="body">{containerData.confog}</Typography>
            </Panel>
        </div>
    )
}