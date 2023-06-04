import './NavigationSettingsTable.scss'
import { useCallback } from 'react'
import { useAppSelector } from '../../../shared/lib/hooks/redux'
import { icons } from '../../../shared/lib/helpers/getIcon'
import { Card } from '../../../shared/ui'
import { isFavouritesItems } from '../lib/helpers/isFavourite'
import { SettingsNavigationItem } from '../models/settingsNavItem'
import { NavigationSettingsItem } from './NavigationSettingsItem'
import { NavigationSettingsButtons } from './NavigationSettingsButton'

export const SettingsNavigationTable = () => {

	const navigation = useAppSelector(state=>state.navigation)

	function getIconNodeOrString(iconName: string) {
		if(iconName in icons)
		{
			const Icon = icons[iconName]
			return (<Icon/>)
		}
		return iconName
	}

	const getData = useCallback(() => {
		return navigation.items.map((item):SettingsNavigationItem=>({
			title: item.title,
			url: item.url,
			icon: getIconNodeOrString(item.icon),
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