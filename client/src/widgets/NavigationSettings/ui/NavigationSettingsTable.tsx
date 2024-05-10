import './NavigationSettingsTable.scss'
import './Table.scss'
import { useCallback } from 'react'
import { useAppSelector } from '../../../shared/lib/hooks/redux'
import { Card } from "alex-evo-sh-ui-kit"
import { SettingsNavigationItem } from '../models/settingsNavItem'
import { NavigationSettingsItem } from './NavigationSettingsItem'
import { NavigationSettingsButtons } from './NavigationSettingsButton'
import { isFavouritesItems } from '../../../features/Navigation'
import { IconOrString } from '../../../entites/Icon'

interface SettingsNavigationTableProps{
	className?: string
}

export const SettingsNavigationTable = ({className}:SettingsNavigationTableProps) => {

	const navigation = useAppSelector(state=>state.navigation)

	console.log(navigation)

	const getData = useCallback(() => {
		return navigation.items.map((item):SettingsNavigationItem=>({
			title: item.title,
			url: item.url,
			icon: <IconOrString iconName={item.icon}/>,
			action: isFavouritesItems(item, navigation.favouritesItems)
		}))
	},[navigation])
	
	return(
		<Card header='Navigation settings' action={<NavigationSettingsButtons/>} className={className}>
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