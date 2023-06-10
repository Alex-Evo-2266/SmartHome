import { logout } from "../../../entites/User"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { Card, FilledButton } from "../../../shared/ui"
import './page.scss'

export const Page403 = () => {


	return(
		<div className="page-403">
			<Card header="The user has not been granted an access level." action={<Buttons/>}>
				<br/>
			</Card>
		</div>
	)
}

function Buttons() {

	const dispatch = useAppDispatch()

	return(
		<div className="buttons">
			<FilledButton onClick={()=>dispatch(logout())}>logout</FilledButton>
		</div>
	)
}