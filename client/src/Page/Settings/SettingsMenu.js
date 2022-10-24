import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from '../../components/table/table'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { setUserFields } from '../../store/reducers/menuReducer'

export const SettingsMenuPage = () => {
	const menu = useSelector(state => state.menu)
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const {request, error, clearError} = useHttp()
	const {message} = useMessage()

	const save = useCallback(async() => {
		await request("/api/menu", "PUT", menu.insluedField, {Authorization: `Bearer ${auth.token}`})
	},[auth.token, request, menu.insluedField])

	const actionField = useCallback((field) => {
		for (const iterator of menu.insluedField) {
			if (iterator.title === field.title)
				return true
		}
		return false
	},[menu.insluedField])

	const clickrow = useCallback(row => {
		if (actionField(row))
			dispatch(setUserFields(menu.insluedField.filter(item=>item.title !== row.title)))
		else{
			const arr = menu.insluedField.slice()
			arr.push(row)
			dispatch(setUserFields(arr))
		}
	},[actionField, dispatch, menu.insluedField])

	const getFields = useCallback(()=>{
		let arr = []
		for (let iterator of JSON.parse(JSON.stringify(menu.fields))) {
			delete iterator.id
			arr.push(
				{
					onClick: clickrow,
					data: iterator,
					action: actionField(iterator)
				})
		}
		return arr
	},[menu.fields, actionField, clickrow])

	useEffect(()=>{
		message(error, 'error');
		clearError();
	  },[error, message, clearError])

	return (
		<div>
			<Table col={[
				{title: "title",name: "title"},
				{title: "icon", type: "icon", name:"iconClass"},
				{title: "url", name: "url"}
			]} items={getFields()}/>
			<div>
				<button className='btn' onClick={save}>save</button>
			</div>
		</div>
	)
}
