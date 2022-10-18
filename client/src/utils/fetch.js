const refresh = async (token, login, logout)=>{
	const response = await fetch("/api/auth/refresh", {method:"GET", body:null, headers:{}});
	const data = await response.json()
	if (!response.ok) {
		if (typeof(logout) == "function")
			logout()
		throw new Error(data.message||'что-то пошло не так')
	}
	if (typeof(login) == "function")
		await login(data.token, data.userId, data.userLavel)
	return data.token
}

const request = async (url, method="GET", body = null,token) => {
	try {
		let headers = {}
		if(token)
		{
			headers['Authorization-Token'] = token
			headers['Authorization'] = token
		}
		if(body){
			headers['Content-Type'] = 'application/json'
			body = JSON.stringify(body);
		}
		let response = await fetch(url, {method, body, headers});
		if (response.status === 401){
			const new_token = await refresh()
			headers["Authorization-Token"] = `Bearer ${new_token}`
			headers['Authorization'] = `Bearer ${new_token}`
			response = await fetch(url, {method, body, headers});
		}
		const data = await response.json()
		if (!response.ok) {
			throw new Error(data||'что-то пошло не так')
		}
		return data;
	}
	catch (e) {
		throw new Error(e.message||'что-то пошло не так')
	}
}
