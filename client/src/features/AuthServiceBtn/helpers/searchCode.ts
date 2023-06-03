export const searchCode = ()=>{
	let params = (new URL(String(document.location))).searchParams;
	return {code: params.get("code"), state: params.get("state")}
}