import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { FetchFunction } from "alex-evo-web-constructor"
import { TypeRequest } from "../../../shared/api/type"

export const useFetch = (moduleName:string | undefined = "") => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const fetchData: FetchFunction = useCallback(async (url: string, method?: string, body?: BodyInit | null, headers?: HeadersInit) => {
        await request(`/api-pages/api/${moduleName}/${url}`, getMethod(method), await bodyInitToDict(body), headersInitToDict(headers))
    },[request, moduleName])


    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        fetchData,
        loading
    }
}

function searchParamsToDict(params: URLSearchParams): Record<string, any> {
    const result: Record<string, any> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  async function formDataToDict(formData: FormData): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      result[key] = value;
    }
    return result;
  }

async function bodyInitToDict(body?: BodyInit | null): Promise<Record<string, any> | undefined> {
    if (body === null || body === undefined) return undefined
    if (body instanceof FormData) {
      return formDataToDict(body);
    } else if (body instanceof URLSearchParams) {
      return searchParamsToDict(body);
    } else if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return { _raw: body };
      }
    } else if (body instanceof Blob) {
      return { _blob: body };
    } else {
      return { _unknown: body };
    }
  }

  function headersToDict(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  function headersInitToDict(headersInit?: HeadersInit): Record<string, string> {
    if (headersInit === null || headersInit === undefined) return {}
    const headers = new Headers(headersInit);
    return headersToDict(headers);
  }

  function getMethod(methodStr?: string): TypeRequest {
    if(!methodStr)return TypeRequest.GET
    const normalizedMethod = methodStr.toUpperCase() as keyof typeof TypeRequest;
    return TypeRequest[normalizedMethod] || TypeRequest.GET;
  }