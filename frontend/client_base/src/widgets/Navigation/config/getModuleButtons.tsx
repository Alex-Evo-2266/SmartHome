import { NavigationButton as NB } from 'alex-evo-sh-ui-kit'
import { NavigationItem } from '../../../entites/navigation' // тип items из useNavigationData

export const getModuleButtons = (navigation: NavigationItem[]): NB[] =>
  navigation.map(item => ({
    to: `module_pages/${item.service}${item.path}`,
    text: item.page_name,
    type: "link",
    icon: <></>
  }))
