import { AlignJustify, Home } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks/redux'
import './NavigationRail.scss'
import { NavigationRailItem } from './NavigationRailItem'
import { IconOrString } from '../../../../entites/Icon'
import { NavButton } from './NavButton'
import { toggleNavigation } from '../../../../features/Navigation/lib/reducers/NavigationReducer'

export const NavigationRail = () => {

    const navigation = useAppSelector(state=>state.navigation)
    const dispatch = useAppDispatch()

    return(
        <div className={`navigation-rail-container`}>
            <div className='navigation-block'>
                <div className='block-content'>
                    <NavButton icon={<AlignJustify/>} onClick={()=>dispatch(toggleNavigation())}/>
                    <NavigationRailItem title='Home' icon={<Home/>} to='/home'/>
                {
                    navigation.favouritesItems.map((item, index)=>(
                        <NavigationRailItem key={index} title={item.title} icon={<IconOrString iconName={item.icon}/>} to={item.url}/>
                    ))
                }
                </div>
            </div>
        </div>
    )
}