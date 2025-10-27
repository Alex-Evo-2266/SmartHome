import { Panel } from 'alex-evo-sh-ui-kit';
import { WebConstructor } from 'alex-evo-web-constructor';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MENU_ROOT_ID, MODAL_ROOT_ID } from '../../../const';
import { useModulePageAPI } from '../../../entites/modulePages';
import { PageData } from '../../../entites/modulePages/models/page';
import { useNavigationData } from '../../../entites/navigation';
import { useToken } from '../../../entites/navigation/api/get_temp_token';
import { Loading } from '../../../shared/ui/Loading';
import { useFetch } from '../api/moduleFetch';

import './modules.scss'

export const ModulesPage = () => {

    const {navigation: navigations, prefix} = useNavigationData()
    const {moduleName, pageName} = useParams<{ moduleName: string, pageName:string }>();
    const navigation = useMemo(
        ()=>navigations.find(item=>item.service === moduleName && item.page_name === pageName),
        [navigations, pageName, moduleName]
    )
    const {token} = useToken(navigation?.type === "website"?moduleName || "": "")

    
    const {getPage, loading} = useModulePageAPI()
    const [pageData, setPageData] = useState<null | PageData>(null)
    const {fetchData} = useFetch(moduleName)

    if(!moduleName || !pageName)
        throw new Error("error page url")

    const loadPage = useCallback(async()=>{
        if(navigation?.type === "module")
        {
            const data = await getPage(moduleName, pageName)
            setPageData(data)
        }
    },[getPage, moduleName, pageName, navigation?.type])

    useEffect(()=>{
        loadPage()
    },[loadPage])

    if(loading)
    {
        return (<Loading/>)
    }

    if(!navigation){
        return (
            <div>
                error loading page
            </div>
        )
    }

    if(navigation.type === "website" && token !== "" && token !== undefined && token !== null){
        return (
            <div className='container-page' style={{height: "calc(100% - 10px)"}}>
                <Panel style={{height: "calc(100% - 32px)"}}>
                    <iframe style={{height: "100%"}} className='modules-frame' src={`/${prefix}/${navigation.service}${navigation.path}?temp_token=${token}`}>
                    </iframe>
                </Panel>
            </div>
        )
    }


    if(!pageData)
    {
        return (
            <div>
                error loading page
            </div>
        )
    }

    return (
        <div className='container-page'>
            <WebConstructor 
            containerMenu={document.getElementById(MENU_ROOT_ID)} 
            containerModal={document.getElementById(MODAL_ROOT_ID)}
            data={pageData.page.page} 
            dialogs={pageData.dialogs} 
            menu={pageData.menu}
            fetchFunction={fetchData}
            />
        </div>
    )
}