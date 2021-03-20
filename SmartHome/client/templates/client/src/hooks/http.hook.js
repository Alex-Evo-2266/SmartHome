import {useState, useCallback} from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(async (url, method="GET", body = null, headers = {},file=false) => {
    setLoading(true);
    try {
      if(headers['X-CSRFToken']===""||!headers['X-CSRFToken'])
        headers['X-CSRFToken'] = 'zoP8fbLHPAnLZpAx6CgpKnHnLMJVJQZzhZ7TJfh0hxUjdCUhGTitLkksprYcxZF4'
      if(body&&!file){
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body);
      }
      const response = await fetch(url, {method, body, headers});
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message||'что-то пошло не так')
      }
      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message)
    }
  },[]);

  const clearError = useCallback(() => {setError(null)},[]);

  return {loading, request, error, clearError}
}
