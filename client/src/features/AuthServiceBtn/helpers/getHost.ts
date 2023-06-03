export const getHost = ()=>{
	console.log(window.location.host)
	let host = window.location.host
	host = "http://" + host
	return host
}