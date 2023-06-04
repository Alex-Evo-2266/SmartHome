import './NavigationSettingsTable.scss'
import { useCallback } from 'react'
import { useAppSelector } from '../../../shared/lib/hooks/redux'
import { Card } from '../../../shared/ui'
import { SettingsNavigationItem } from '../models/settingsNavItem'
import { NavigationSettingsItem } from './NavigationSettingsItem'
import { NavigationSettingsButtons } from './NavigationSettingsButton'
import { isFavouritesItems } from '../../../features/Navigation'
import { IconOrString } from '../../../entites/Icon'

export const SettingsNavigationTable = () => {

	const navigation = useAppSelector(state=>state.navigation)

	const getData = useCallback(() => {
		return navigation.items.map((item):SettingsNavigationItem=>({
			title: item.title,
			url: item.url,
			icon: <IconOrString iconName={item.icon}/>,
			action: isFavouritesItems(item, navigation.favouritesItems)
		}))
	},[navigation])
	
	return(
		<Card header='Navigation settings' action={<NavigationSettingsButtons/>}>
			<div className='settings-navigation-container table-container'>
				<table>
					<thead>
						<tr>
							<th></th>
							<th>title</th>
							<th>url</th>
							<th>icon</th>
						</tr>
					</thead>
					<tbody>
						{
							getData().map((item, index)=>(
								<NavigationSettingsItem key={index} item={item}/>
							))
						}
					</tbody>
				</table>
			</div>
		</Card>
		
	)
}