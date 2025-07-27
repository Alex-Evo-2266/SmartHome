
import { useParams } from 'react-router-dom';
import { useModulePageAPI } from '../../../entites/modulePages';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loading } from '../../../shared/ui/Loading';
import { WebConstructor } from 'alex-evo-web-constructor';
import { PageData } from '../../../entites/modulePages/models/page';
import { MENU_ROOT_ID, MODAL_ROOT_ID } from '../../../const';
import { useFetch } from '../api/moduleFetch';
import { useNavigationData } from '../../../entites/navigation';

export const ModulesPage = () => {

    const {navigation: navigations} = useNavigationData()
    const { moduleName, pageName } = useParams<{ moduleName: string, pageName:string }>();

    const navigation = useMemo(
        ()=>navigations.find(item=>item.service === moduleName && item.page_name === pageName),
        [navigations]
    )



    const {getPage, loading} = useModulePageAPI()
    const [pageData, setPageData] = useState<null | PageData>(null)
    const {fetchData} = useFetch(moduleName)

    if(!moduleName || !pageName)
        throw new Error("error page url")

    const loadPage = useCallback(async()=>{
        const data = await getPage(moduleName, pageName)
        setPageData(data)
    },[getPage, moduleName, pageName])

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

    if(navigation.type === "website"){
        return (
            <div className='container-page'>
                <iframe>

                </iframe>
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